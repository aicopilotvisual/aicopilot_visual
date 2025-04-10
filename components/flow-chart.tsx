"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AutomationStep } from "@/lib/types";
import { ArrowRight, AlertCircle, Maximize2, ChevronDown, ChevronUp, Info, ArrowDown, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FlowChartProps {
  steps: AutomationStep[];
}

export default function FlowChart({ steps }: FlowChartProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<AutomationStep | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');

  const handleStepClick = (step: AutomationStep) => {
    setSelectedStep(step);
    setDialogOpen(true);
  };

  const toggleExpand = (stepId: string) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
  };

  const getComplexityColor = (complexity: string | undefined) => {
    if (!complexity) return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
    
    return complexity === 'low' 
      ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
      : complexity === 'medium' 
        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' 
        : 'bg-red-500/20 text-red-600 dark:text-red-400';
  };

  return (
    <Card className="h-full bg-card/80 backdrop-blur-xl border-2 shadow-lg rounded-2xl overflow-hidden flex flex-col relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none"></div>
      
      <div className="p-5 border-b bg-card/90 backdrop-blur-md shadow-sm relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <span>Automation Flow</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1 pl-11">Visual representation of your workflow</p>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setViewMode(viewMode === 'vertical' ? 'horizontal' : 'vertical')}
                    className="text-xs px-4 py-2 h-9 bg-card/70 border-2 rounded-full transition-all duration-300 hover:bg-primary/10"
                  >
                    {viewMode === 'vertical' ? 'Horizontal' : 'Vertical'} View
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-amber-50 border-2 shadow-lg">
                  <p>Change flow visualization style</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto relative">
        <div className={`
          ${viewMode === 'vertical' 
            ? 'flex flex-col items-center space-y-6' 
            : 'flex items-start space-x-6 overflow-x-auto pb-4'}
          transition-all duration-500
        `}>
          {steps.map((step, index) => (
            <div key={step.id} className={`${viewMode === 'vertical' ? 'w-full' : 'flex-shrink-0 w-72'} transition-all duration-300`}>
              <div className="flex items-center justify-center">
                <Card 
                  className={`
                    p-5 ${viewMode === 'vertical' ? 'w-full' : 'w-72'} 
                    ${expandedStep === step.id 
                      ? 'bg-background border-primary ring-4 ring-primary/20 translate-y-0 scale-102' 
                      : 'bg-background/90 backdrop-blur-sm hover:bg-background hover:border-primary/30 hover:-translate-y-1'}
                    transition-all cursor-pointer group 
                    border-2 shadow-md hover:shadow-lg
                    rounded-xl transform duration-300
                  `}
                  onClick={() => handleStepClick(step)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center bg-primary/20 text-primary font-bold w-8 h-8 rounded-full mr-3">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-base line-clamp-1">{step.title}</h3>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {step.complexity && (
                        <span className={`text-xs px-3 py-1 rounded-full ${getComplexityColor(step.complexity)} font-medium`}>
                          {step.complexity}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {expandedStep === step.id ? (
                    <>
                      <p className="text-sm text-foreground mt-3 pl-11">{step.description}</p>
                      {step.tools && step.tools.length > 0 && (
                        <div className="mt-4 pl-11">
                          <p className="text-xs font-semibold mb-2 text-primary/70">Tools:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.tools.map((tool, i) => (
                              <span key={i} className="text-xs bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end mt-4 gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(step.id);
                          }}
                          className="h-9 w-9 p-0 rounded-full"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepClick(step);
                          }}
                          className="h-9 w-9 p-0 rounded-full border-2 hover:bg-primary/10"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground truncate max-w-[70%] pl-11">
                        {step.description}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(step.id);
                        }}
                        className="h-9 w-9 p-0 rounded-full hover:bg-primary/10"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  flex justify-center items-center 
                  ${viewMode === 'vertical' ? 'my-3 h-8' : 'h-full px-3'}
                `}>
                  {viewMode === 'vertical' ? (
                    <div className="bg-card/70 p-2 rounded-full border-2 border-primary/20 shadow-sm animate-pulse">
                      <ArrowDown className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="bg-card/70 p-2 rounded-full border-2 border-primary/20 shadow-sm animate-pulse">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-10 w-full h-72 border-2 border-dashed rounded-2xl bg-card/30 backdrop-blur-sm">
              <div className="bg-muted/40 p-4 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-primary/60" />
              </div>
              <p className="text-center text-base font-medium">Describe your automation idea in the chat</p>
              <p className="text-center text-sm mt-2">Your workflow visualization will appear here</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-6 rounded-full px-4 border-2 border-primary/20 hover:bg-primary/10 transition-all duration-300"
              >
                <ArrowDown className="h-4 w-4 mr-2" /> Start with AI Chat
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed step dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-6 bg-slate-100">
          {selectedStep && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-lg">
                  <span className="pr-2">{selectedStep.title}</span>
                  {selectedStep.complexity && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(selectedStep.complexity)} flex-shrink-0`}>
                      {selectedStep.complexity}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-sm mt-2">
                  {selectedStep.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {selectedStep.tools && selectedStep.tools.length > 0 && (
                  <div className="bg-card/50 p-4 rounded-lg border">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-primary" /> Recommended Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStep.tools.map((tool, i) => (
                        <span 
                          key={i} 
                          className="text-sm bg-primary/10 px-3 py-1 rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-card/50 p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Implementation Notes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This step is marked as <span className={getComplexityColor(selectedStep.complexity).replace('bg-', 'text-').replace('/20', '')}>{selectedStep.complexity || 'medium'}</span> complexity. 
                    {selectedStep.complexity === 'low' && ' It should be relatively straightforward to implement.'}
                    {selectedStep.complexity === 'medium' && ' It may require some technical knowledge to set up properly.'}
                    {selectedStep.complexity === 'high' && ' This step may require specialized knowledge or custom development.'}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}