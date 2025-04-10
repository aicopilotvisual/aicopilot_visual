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
          className:"bg-amber-50"
        });
      }
    } else {
      toast({
        title: "New workflow created",
        description: "Start by describing your automation idea in the chat.",
        className:"bg-amber-50"
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-blue-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-10 z-0"></div>
      
      {/* Glass morphism container */}
      <div className="min-h-screen backdrop-blur-sm bg-background/70 relative z-10 flex flex-col">
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
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl -z-10 animate-pulse" style={{animationDelay: '2s'}}></div>
            
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
      
      {/* Texture overlay */}
      <div className="texture opacity-5"></div>
      
      <Toaster />
    </main>
  );
}