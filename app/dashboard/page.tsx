"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import AIChat from "@/components/ai-chat";
import FlowChart from "@/components/flow-chart";
import { AutomationStep } from "@/lib/types";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Navbar from "./navbar";

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [automationSteps, setAutomationSteps] = useState<AutomationStep[]>([]);
  const { toast } = useToast();
  
  // Track window width for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      
      // Set initial value
      handleResize();
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Clean up
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleNewFlow = () => {
    if (automationSteps.length > 0) {
      if (confirm("Are you sure you want to create a new flow? This will clear your current workflow.")) {
        setAutomationSteps([]);
        toast({
          title: "New workflow created",
          description: "Your previous workflow has been cleared.",
          className: "bg-blue-50"
        });
      }
    } else {
      toast({
        title: "New workflow created",
        description: "Start by describing your automation idea in the chat.",
        className: "bg-blue-50"
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-[#253551] dark:to-blue-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5 z-0"></div>
      
      {/* Moving particles effect */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200/20 dark:bg-blue-400/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 30 + 20}s linear infinite`,
              animationDelay: `${Math.random() * 30}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Glass morphism container with subtle motion */}
      <div className="min-h-screen backdrop-blur-lg bg-white/30 dark:bg-[#253551]/30 relative z-10 flex flex-col transition-all duration-700">
        <Navbar
          hasContent={automationSteps.length > 0}
          onNewFlow={handleNewFlow}
          automationSteps={automationSteps}
        />

        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
          {/* Main content area */}
          <div className={`
            flex flex-col lg:flex-row gap-6 
            flex-1
            max-w-7xl mx-auto w-full
            relative z-10
          `}>
            {/* Decorative elements - glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 dark:bg-blue-400/10 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#253551]/10 rounded-full filter blur-3xl -z-10 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-200/10 rounded-full filter blur-2xl -z-10 animate-pulse" style={{animationDelay: '4s'}}></div>
            
            {/* AI Chat panel */}
            <div className={`
              flex-1 min-w-0
              ${isMobile ? 'h-[calc(50vh-4rem)]' : 'h-[calc(100vh-9rem)]'}
              transition-all duration-500 ease-in-out
              transform hover:scale-[1.01]
            `}>
              <AIChat onUpdateSteps={setAutomationSteps} />
            </div>
            
            {/* Flow Chart panel */}
            <div className={`
              flex-1 min-w-0
              ${isMobile ? 'h-[calc(50vh-4rem)]' : 'h-[calc(100vh-9rem)]'}
              transition-all duration-500 ease-in-out
              transform hover:scale-[1.01]
            `}>
              <FlowChart steps={automationSteps} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle water ripple effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-blue-200/20 to-transparent animate-ping" style={{animationDuration: '15s'}}></div>
      </div>
      
      {/* Style to support animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
        }
      `}</style>
      
      <Toaster />
    </main>
  );
}