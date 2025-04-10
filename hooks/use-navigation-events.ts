"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useNavigationEvents() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Store the current pathname and search params
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // When pathname or search params change, set isNavigating to true
    setIsNavigating(true);
    
    // After a short delay, set isNavigating to false to simulate the navigation completion
    timeoutId = setTimeout(() => {
      setIsNavigating(false);
    }, 800); // Adjust timing as needed
    
    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);
  
  return isNavigating;
}