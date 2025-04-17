"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, AlertCircle, Paperclip, Sparkles, Lock, Mic, MicOff } from "lucide-react";
import { AutomationStep } from "@/lib/types";
import { analyzeAutomation } from "@/lib/openai";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@clerk/nextjs";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface AIChatProps {
  onUpdateSteps: (steps: AutomationStep[]) => void;
}

// Maximum number of messages allowed per user
const MAX_MESSAGES_PER_USER = 2;

export default function AIChat({ onUpdateSteps }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Load message count from localStorage on component mount
  useEffect(() => {
    if (userId) {
      const storedCount = localStorage.getItem(`messageCount_${userId}`);
      if (storedCount) {
        setUserMessageCount(parseInt(storedCount, 10));
      }
    }
  }, [userId]);

  // Update localStorage when message count changes
  useEffect(() => {
    if (userId && userMessageCount > 0) {
      localStorage.setItem(`messageCount_${userId}`, userMessageCount.toString());
    }
  }, [userId, userMessageCount]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const isMessageLimitReached = userMessageCount >= MAX_MESSAGES_PER_USER;

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to describe your automation idea.",
        duration: 3000,
        className: "bg-blue-50 border border-blue-200",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Transcribe audio using OpenAI API
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Create a file from the audio blob
      const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
      
      // Create form data
      const formData = new FormData();
      formData.append("audio", file);
      
      // Send to our API route
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.text) {
        // Append transcribed text to input field
        setInput((prev) => {
          const newInput = prev ? `${prev} ${data.text}` : data.text;
          return newInput;
        });
        
        toast({
          title: "Transcription complete",
          description: "Your speech has been converted to text.",
          duration: 3000,
          className: "bg-blue-50 border border-blue-200",
        });
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast({
        title: "Transcription Error",
        description: "Failed to convert speech to text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Check if user is signed in
    if (!isSignedIn || !userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has reached message limit
    if (isMessageLimitReached) {
      toast({
        title: "Message limit reached",
        description: "You've reached your limit of 2 messages. Please upgrade for unlimited access.",
        variant: "destructive",
      });
      return;
    }
    
    setError(null);
    const userMessage = { id: uuidv4(), role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Increment user message count
    setUserMessageCount(prevCount => prevCount + 1);

    try {
      // Check if input is too simple (like "hi")
      if (input.trim().length < 5) {
        const guidanceMessage = {
          id: uuidv4(),
          role: "assistant" as const,
          content: "Please provide more details about what you'd like to automate. For example: 'I want to automate my customer onboarding process' or 'Help me create an automation for processing invoice approvals.'"
        };
        setTimeout(() => {
          setMessages(prev => [...prev, guidanceMessage]);
          setIsLoading(false);
        }, 500);
        return;
      }

      console.log("Calling analyzeAutomation with prompt:", input);
      const analysis = await analyzeAutomation(input);

      // Format steps for display
      const stepsText = analysis.steps.map((step, index) => {
        const stepNum = index + 1;
        const toolsText = step.tools && step.tools.length > 0 
          ? `Tools: ${step.tools.join(', ')}` 
          : '';
        
        return `
        ${stepNum}. ${step.title}
          ${step.description}
          Complexity: ${step.complexity || 'medium'}
          ${toolsText}`;
      }).join('\n');

      // Format platforms for display
      const platformsText = analysis.recommendations.platforms.length > 0
        ? analysis.recommendations.platforms.join(', ')
        : "No specific platforms recommended";

      // Format considerations for display
      const considerationsText = analysis.recommendations.considerations.length > 0
        ? analysis.recommendations.considerations.join('\n')
        : "No specific considerations provided";

      // Create assistant message with the analysis
      const assistantMessage = {
        id: uuidv4(),
        role: "assistant" as const,
        content: `I've analyzed your automation request and broken it down into ${analysis.steps.length} steps. Here are my recommendations:
          ${stepsText}

          Recommended Platforms:
          ${platformsText}

          Key Considerations:
          ${considerationsText}`
      };

      setMessages(prev => [...prev, assistantMessage]);
      onUpdateSteps(analysis.steps);
      
      // Notification that steps have been updated
      toast({
        title: "Workflow created",
        description: `Created a ${analysis.steps.length}-step automation workflow.`,
        duration: 3000,
        className: "bg-blue-50 border border-blue-200",
      });
      
    } catch (error) {
      console.error("Error in handleSend:", error);
      
      // Log the error details
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        setError(error.message);
      }
      
      // Show error message to user
      const errorMessage = {
        id: uuidv4(),
        role: "assistant" as const,
        content: "I apologize, but I encountered an error while analyzing your request. Please try again with more details about what you'd like to automate."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      
      // Focus back on input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Handle premium upgrade click
  const handlePremiumClick = () => {
    toast({
      title: "Coming soon!",
      description: "Premium upgrade will be available in a future update.",
      duration: 3000,
      className: "bg-blue-50 border border-blue-200",
    });
  };

  // Get user-friendly display of remaining messages
  const getRemainingMessagesText = () => {
    if (!isSignedIn) return "Sign in to send messages";
    
    const remaining = MAX_MESSAGES_PER_USER - userMessageCount;
    if (remaining <= 0) return "Message limit reached";
    return `${remaining} message${remaining !== 1 ? 's' : ''} remaining`;
  };

  return (
    <Card className="h-full flex flex-col relative group rounded-3xl overflow-hidden border-0">
      {/* Glass morphism effect - layered backgrounds */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 to-white/60 dark:from-[#253551]/90 dark:to-blue-900/40 z-0"></div>
      <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5 mix-blend-overlay z-0"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 border-2 border-blue-200 dark:border-[#253551]/70 rounded-3xl z-0 group-hover:border-blue-300 dark:group-hover:border-[#253551] transition-colors duration-500"></div>
      
      {/* Animated gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-[#253551] to-blue-400 opacity-70 dark:opacity-100 animate-shimmer"></div>
      
      <div className="p-5 border-b border-blue-100/50 dark:border-[#253551]/30 bg-white/80 dark:bg-[#253551]/20 backdrop-blur-md shadow-sm relative z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2 text-[#253551] dark:text-white">
            <div className="bg-[#253551]/10 dark:bg-blue-300/20 p-2 rounded-full shadow-inner transition-all duration-300 transform group-hover:scale-110">
              <Bot className="w-5 h-5 text-[#253551] dark:text-blue-200" />
            </div>
            <span className="relative">
              AI Assistant
              <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-[#253551] dark:bg-blue-300 transition-all duration-500"></span>
            </span>
          </h2>
          <div className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white/70 dark:bg-[#253551]/40 rounded-full border border-blue-200/50 dark:border-blue-500/30 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            {isMessageLimitReached ? <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" /> : null}
            <span className="text-[#253551] dark:text-blue-100">{getRemainingMessagesText()}</span>
          </div>
        </div>
        <p className="text-sm text-[#253551]/70 dark:text-blue-200/70 mt-1 pl-11">Let&apos;s design your automation workflow</p>
      </div>

      {error && (
        <div className="p-3 mx-4 my-2 bg-red-50/80 backdrop-blur-sm dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center animate-pulse shadow-md">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {isMessageLimitReached && (
        <div className="p-3 mx-4 my-2 bg-blue-50/80 backdrop-blur-sm dark:bg-[#253551]/30 text-[#253551] dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800/50 flex items-center shadow-md">
          <Lock className="w-4 h-4 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-300" />
          <div>
            <p className="text-sm font-medium">Message limit reached</p>
            <p className="text-xs mt-0.5">You&apos;ve used all your free messages. Upgrade your plan for unlimited access.</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 relative z-10 scroll-smooth" ref={scrollAreaRef}>
        <div className="space-y-6 pb-2">
          {messages.length === 0 && (
            <div className="text-center text-[#253551]/90 dark:text-blue-100/90 p-8 rounded-xl border-2 border-dashed border-blue-200/50 dark:border-blue-500/30 bg-white/40 dark:bg-blue-900/20 backdrop-blur-sm flex flex-col items-center shadow-sm transition-all duration-500 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-400/50">
              <div className="bg-blue-100 dark:bg-[#253551]/60 p-3 rounded-full mb-4 shadow-inner transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                <Sparkles className="w-8 h-8 text-[#253551] dark:text-blue-300" />
              </div>
              <p className="font-semibold mb-3 text-base">How to get started</p>
              <p className="text-sm max-w-md">Describe the workflow or process you want to automate in detail.</p>
              <p className="text-sm mt-4 italic bg-white/50 dark:bg-[#253551]/40 p-3 rounded-lg max-w-lg shadow-inner border border-blue-100/50 dark:border-blue-900/50">
                &quot;I want to automate my customer onboarding process including email verification, document collection, and account setup.&quot;
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === "assistant" ? "flex-row" : "flex-row-reverse"
              } animate-in fade-in-0 slide-in-from-bottom-3 duration-500`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 hover:scale-110
                ${message.role === "assistant" 
                  ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-[#253551]/80 dark:to-blue-700/60 border border-blue-300/50 dark:border-blue-500/30" 
                  : "bg-gradient-to-br from-[#253551] to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg"}
              `}>
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-[#253551] dark:text-blue-200" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`rounded-2xl p-4 max-w-[90%] transition-all duration-300 backdrop-blur-sm hover:shadow-md ${
                  message.role === "assistant"
                    ? "bg-white/70 dark:bg-[#253551]/40 border border-blue-100 dark:border-blue-700/30 shadow-sm" 
                    : "bg-[#253551] dark:bg-blue-600/80 text-white shadow"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans break-words text-sm leading-relaxed">{message.content}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-blue-200/70 dark:border-[#253551]/50 border-t-[#253551] dark:border-t-blue-400 animate-spin shadow-md relative z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#253551] dark:text-blue-300" />
                  </div>
                </div>
                <p className="text-sm text-[#253551]/80 dark:text-blue-200/80 mt-4 animate-pulse">Analyzing automation requirements...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 border-t border-blue-100/50 dark:border-[#253551]/30 bg-white/80 dark:bg-[#253551]/20 backdrop-blur-md shadow-inner relative z-10">
        <div className="flex gap-3 items-center">
          {/* Microphone button */}
          <Button 
            variant="outline" 
            size="icon" 
            className={`
              flex-shrink-0 h-11 w-11 rounded-full shadow-md border-2 transition-all duration-500 transform hover:scale-105
              ${isRecording || isTranscribing
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-600 border-red-500 animate-pulse" 
                : "bg-white dark:bg-[#253551]/50 hover:bg-blue-50 dark:hover:bg-[#253551]/70 text-[#253551] dark:text-blue-200 border-blue-200 dark:border-blue-700/50 hover:border-[#253551] dark:hover:border-blue-500"}
            `}
            onClick={toggleRecording}
            disabled={isLoading || isMessageLimitReached || !isSignedIn || isTranscribing}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 animate-pulse" />
            ) : isTranscribing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          
          <div className="relative flex-1">
            {/* Subtle glowing effect for the input */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-300/40 via-[#253551]/30 to-blue-300/40 rounded-full blur-sm ${input ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}></div>
            
            <Input
              placeholder={
                isRecording 
                  ? "Recording... Click the microphone icon to stop" 
                  : isTranscribing
                  ? "Transcribing your audio..."
                  : isMessageLimitReached 
                  ? "Message limit reached" 
                  : "Describe your automation idea or click the mic to speak..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={isLoading || isMessageLimitReached || !isSignedIn || isRecording || isTranscribing}
              ref={inputRef}
              className={`
                min-h-11 text-sm py-3 rounded-full px-5 border-2 relative z-10
                bg-white/80 dark:bg-[#253551]/40 backdrop-blur-md text-[#253551] dark:text-blue-100
                focus-visible:ring-[#253551] dark:focus-visible:ring-blue-400 
                focus-visible:border-[#253551]/50 dark:focus-visible:border-blue-500/50 
                shadow-sm transition-all duration-500 placeholder:text-[#253551]/50 dark:placeholder:text-blue-300/50
                ${isRecording || isTranscribing 
                  ? "border-red-500/50 bg-red-50/50 dark:bg-red-900/20" 
                  : "border-blue-200 dark:border-blue-700/50 hover:border-[#253551]/50 dark:hover:border-blue-500/50"}
              `}
            />
          </div>
          
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim() || isMessageLimitReached || !isSignedIn || isRecording || isTranscribing} 
            className={`
              flex-shrink-0 h-11 w-11 rounded-full
              transition-all duration-500 transform hover:scale-105
              ${(input.trim() && !isMessageLimitReached) 
                ? "bg-gradient-to-br from-[#253551] to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:shadow-blue-200/50 dark:hover:shadow-blue-500/30 hover:shadow-lg" 
                : "bg-blue-100 dark:bg-blue-800/40 text-[#253551] dark:text-blue-300"}
              shadow-md hover:shadow-xl
              ${isMessageLimitReached || isRecording || isTranscribing ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isLoading ? 
              <Loader2 className="w-5 h-5 animate-spin" /> : 
              isMessageLimitReached ? <Lock className="w-5 h-5" /> : <Send className="w-5 h-5" />
            }
          </Button>
        </div>
        {isMessageLimitReached && (
          <div className="mt-3 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-gradient-to-r from-blue-50 to-white dark:from-[#253551]/60 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-50 dark:hover:from-[#253551]/80 dark:hover:to-blue-700/40 border-blue-200 dark:border-blue-700/50 text-[#253551] dark:text-blue-300 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
              onClick={handlePremiumClick}
            >
              Upgrade to Premium
            </Button>
          </div>
        )}
      </div>
      
      {/* Animated corner decorations */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-300/30 dark:from-blue-500/20 to-transparent rounded-bl-full pointer-events-none opacity-70 z-0"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-300/30 dark:from-blue-500/20 to-transparent rounded-tr-full pointer-events-none opacity-70 z-0"></div>
    </Card>
  );
}