"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, AlertCircle, Paperclip, Sparkles, Lock } from "lucide-react";
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
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const isMessageLimitReached = userMessageCount >= MAX_MESSAGES_PER_USER;

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
        className:"bg-amber-50"
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

  const handleAttachmentClick = () => {
    toast({
      title: "Feature coming soon",
      description: "File attachment functionality will be available in a future update.",
    });
  };

  // Handle premium upgrade click
  const handlePremiumClick = () => {
    toast({
      title: "Coming soon!",
      description: "Premium upgrade will be available in a future update.",
      duration: 3000,
      className: "bg-amber-50",
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
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-xl border-2 shadow-lg rounded-2xl overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="p-5 border-b bg-card/90 backdrop-blur-md shadow-sm relative z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <span>AI Assistant</span>
          </h2>
          <div className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full">
            {isMessageLimitReached ? <Lock className="w-3.5 h-3.5" /> : null}
            <span>{getRemainingMessagesText()}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 pl-11">Let&apos;s design your automation workflow</p>
      </div>

      {error && (
        <div className="p-3 mx-4 my-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center animate-pulse">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {isMessageLimitReached && (
        <div className="p-3 mx-4 my-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center">
          <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Message limit reached</p>
            <p className="text-xs mt-0.5">You&apos;ve used all your free messages. Upgrade your plan for unlimited access.</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5" ref={scrollAreaRef}>
        <div className="space-y-6 pb-2">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground p-8 rounded-xl border-2 border-dashed bg-card/30 backdrop-blur-sm flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="font-semibold mb-3 text-base">How to get started</p>
              <p className="text-sm max-w-md">Describe the workflow or process you want to automate in detail.</p>
              <p className="text-sm mt-4 italic bg-muted/50 p-3 rounded-lg max-w-lg">&quot;I want to automate my customer onboarding process including email verification, document collection, and account setup.&quot;</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === "assistant" ? "flex-row" : "flex-row-reverse"
              } animate-in fade-in-0 duration-300`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${message.role === "assistant" 
                  ? "bg-primary/20 border border-primary/30" 
                  : "bg-primary text-primary-foreground shadow-md"}
              `}>
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div
                className={`rounded-2xl p-4 max-w-[90%] ${
                  message.role === "assistant"
                    ? "bg-card border shadow-sm" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans break-words text-sm">{message.content}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Analyzing automation requirements...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 border-t bg-card/90 backdrop-blur-md relative z-10">
        <div className="flex gap-3 items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0 h-11 w-11 rounded-full border-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            onClick={handleAttachmentClick}
            disabled={isLoading || isMessageLimitReached || !isSignedIn}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder={isMessageLimitReached ? "Message limit reached" : "Describe your automation idea..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isLoading || isMessageLimitReached || !isSignedIn}
            ref={inputRef}
            className="min-h-11 text-sm py-3 rounded-full px-5 border-2 border-primary/20 focus-visible:ring-primary focus-visible:border-primary/50 shadow-sm transition-all duration-300"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim() || isMessageLimitReached || !isSignedIn} 
            className={`
              flex-shrink-0 h-11 w-11 rounded-full
              transition-all duration-300
              ${(input.trim() && !isMessageLimitReached) ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"}
              shadow-md hover:shadow-lg
              ${isMessageLimitReached ? "opacity-50 cursor-not-allowed" : ""}
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
              className="text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
              onClick={handlePremiumClick}
            >
              Upgrade to Premium
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}