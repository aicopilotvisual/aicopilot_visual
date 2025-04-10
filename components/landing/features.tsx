"use client";

import { Bot, Zap, ShieldCheck, Share2 } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-card/80 backdrop-blur-sm rounded-lg border-2 shadow-sm transition-all hover:shadow-md">
      <div className="rounded-full bg-primary/20 p-3 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <div className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Powerful Automation Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, visualize, and implement your automation workflows
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Bot className="h-6 w-6 text-primary" />}
            title="AI-Powered Analysis"
            description="Describe your workflow in plain language and let our AI break it down into actionable steps"
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Visual Workflows"
            description="See your processes as intuitive flowcharts that are easy to understand and implement"
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            title="Complexity Analysis"
            description="Automatically identify complex steps in your workflow that might need extra attention"
          />
          <FeatureCard 
            icon={<Share2 className="h-6 w-6 text-primary" />}
            title="Easy Sharing"
            description="Export and share your workflows with team members or stakeholders in one click"
          />
        </div>
      </div>
    </div>
  );
}