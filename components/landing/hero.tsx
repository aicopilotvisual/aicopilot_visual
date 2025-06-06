"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-3 md:py-20 text-center overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Animated circles in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-blue-200/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className={`flex flex-col items-center max-w-4xl mx-auto z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="rounded-full bg-[#253551]/20 p-4 mb-6 backdrop-blur-md border border-white/30 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Bot className="h-10 w-10 text-[#253551]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#253551] drop-shadow-sm">
          Automation Made Visual
        </h1>
        <p className="text-xl md:text-2xl text-[#253551]/80 mb-8 max-w-2xl">
          Design and visualize your automation workflows with AI assistance.
          Transform complex processes into clear, actionable steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="https://lokicreatesai.me" target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/70 backdrop-blur-sm border-2 border-[#253551]/30 text-[#253551] hover:bg-[#253551]/10 hover:border-[#253551] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Learn More
            </Button>
          </Link>
          <Link href="https://tally.so/r/3jzXG1" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-[#253551]/90 backdrop-blur-sm text-white border border-[#253551]/50 hover:bg-[#253551] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Add custom CSS for the bounce animation */}
      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s infinite;
        }
      `}</style>
    </div>
  );
}