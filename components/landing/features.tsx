"use client";

import { useEffect, useState } from "react";
import { Bot, Zap, ShieldCheck, Share2 } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`flex flex-col items-center p-6 bg-white/40 backdrop-blur-lg rounded-lg border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:translate-y-[-5px] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="rounded-full bg-[#253551]/20 p-4 mb-4 border border-white/30 shadow-md transform hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[#253551]">{title}</h3>
      <p className="text-[#253551]/80 text-center">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <div className="py-16 px-4 relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#253551]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#253551]/5 blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#253551] relative inline-block">
            Powerful Automation Features
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-[#253551]/30 rounded-full"></span>
          </h2>
          <p className="text-xl text-[#253551]/70 max-w-2xl mx-auto mt-6">
            Everything you need to create, visualize, and implement your automation workflows
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Bot className="h-6 w-6 text-[#253551]" />}
            title="AI-Powered Analysis"
            description="Describe your workflow in plain language and let our AI break it down into actionable steps"
            delay={100}
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-[#253551]" />}
            title="Visual Workflows"
            description="See your processes as intuitive flowcharts that are easy to understand and implement"
            delay={200}
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6 text-[#253551]" />}
            title="Complexity Analysis"
            description="Automatically identify complex steps in your workflow that might need extra attention"
            delay={300}
          />
          <FeatureCard 
            icon={<Share2 className="h-6 w-6 text-[#253551]" />}
            title="Easy Sharing"
            description="Export and share your workflows with team members or stakeholders in one click"
            delay={400}
          />
        </div>
      </div>
    </div>
  );
}