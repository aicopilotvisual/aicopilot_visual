"use client";

import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 md:py-20 text-center">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        <div className="rounded-full bg-primary/20 p-3 mb-6">
          <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Automation Made Visual
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
          Design and visualize your automation workflows with AI assistance.
          Transform complex processes into clear, actionable steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="https://mechevo.io" target="_blank" rel="noopener noreferrer">
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 hover:bg-primary/10"
          >
            Learn More
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}