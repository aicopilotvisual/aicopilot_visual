"use client";

import { useNavigationEvents } from '@/hooks/use-navigation-events';
import { useEffect, useState } from 'react';

export default function NavigationProgressBar() {
  const isNavigating = useNavigationEvents();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isNavigating) {
      setProgress(0);
      
      // Simulate progress increase
      intervalId = setInterval(() => {
        setProgress(prev => {
          // Slow down as we approach 90%
          const increment = prev < 30 ? 10 : prev < 60 ? 5 : prev < 80 ? 2 : 1;
          const newProgress = Math.min(prev + increment, 90);
          return newProgress;
        });
      }, 100);
    } else {
      // Quickly complete the progress bar when navigation is done
      setProgress(100);
      
      // Reset progress after animation completes
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    
    return () => clearInterval(intervalId);
  }, [isNavigating]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
      <div 
        className="h-full bg-primary shadow-sm transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, transitionProperty: 'width, transform, opacity' }}
      />
    </div>
  );
}