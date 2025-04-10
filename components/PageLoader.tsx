"use client";

import { useNavigationEvents } from '@/hooks/use-navigation-events';
import { Bot } from 'lucide-react';

export default function PageLoader() {
  const isNavigating = useNavigationEvents();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 bg-amber-50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-card border-2 shadow-lg rounded-2xl p-8 flex flex-col items-center animate-in zoom-in-90 duration-300">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="w-7 h-7 text-primary" />
          </div>
        </div>
        
        <div className="mt-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
          <p className="text-sm text-muted-foreground">Preparing your experience</p>
        </div>
      </div>
    </div>
  );
}