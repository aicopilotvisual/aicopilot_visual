"use client";

import { useState, useEffect } from "react";
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
    <Card className="h-full bg-white/40 dark:bg-[#253551]/30 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl overflow-hidden flex flex-col relative transition-all duration-500 hover:shadow-blue-200/30">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 dark:from-blue-500/10 to-transparent pointer-events-none"></div>
      
      <div className="p-5 border-b border-white/20 bg-white/50 dark:bg-[#253551]/40 backdrop-blur-lg shadow-sm relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#253551]">
              <div className="bg-[#253551]/10 dark:bg-blue-400/20 p-2 rounded-full border border-white/30 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#253551]">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#253551] to-blue-500">Automation Flow</span>
            </h2>
            <p className="text-sm text-[#253551]/70 mt-1 pl-11">Visual representation of your workflow</p>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setViewMode(viewMode === 'vertical' ? 'horizontal' : 'vertical')}
                    className="text-xs px-4 py-2 h-9 bg-white/50 dark:bg-[#253551]/30 backdrop-blur-md border border-white/30 rounded-full transition-all duration-300 hover:bg-[#253551]/10 transform hover:scale-105 text-[#253551] shadow-md hover:shadow-blue-200/30"
                  >
                    {viewMode === 'vertical' ? 'Horizontal' : 'Vertical'} View
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-lg">
                  <p>Change flow visualization style</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto relative bg-gradient-to-b from-white/0 to-white/20 dark:from-[#253551]/0 dark:to-[#253551]/20">
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
                      ? 'bg-white/70 dark:bg-[#253551]/60 border-blue-500 ring-4 ring-blue-200/40 dark:ring-blue-400/20 translate-y-0 scale-102' 
                      : 'bg-white/50 dark:bg-[#253551]/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-[#253551]/50 hover:border-blue-300/50 dark:hover:border-blue-400/30 hover:-translate-y-1'}
                    transition-all cursor-pointer group 
                    border border-white/50 shadow-lg hover:shadow-blue-200/30
                    rounded-xl transform duration-300
                  `}
                  onClick={() => handleStepClick(step)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center bg-[#253551]/10 dark:bg-blue-400/20 text-[#253551] dark:text-blue-400 font-bold w-8 h-8 rounded-full mr-3 border border-white/30 shadow-inner">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-base line-clamp-1 text-[#253551] dark:text-blue-100">{step.title}</h3>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {step.complexity && (
                        <span className={`text-xs px-3 py-1 rounded-full ${getComplexityColor(step.complexity)} font-medium backdrop-blur-md`}>
                          {step.complexity}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {expandedStep === step.id ? (
                    <>
                      <p className="text-sm text-[#253551]/80 dark:text-blue-200/80 mt-3 pl-11">{step.description}</p>
                      {step.tools && step.tools.length > 0 && (
                        <div className="mt-4 pl-11">
                          <p className="text-xs font-semibold mb-2 text-[#253551]/70 dark:text-blue-300/70">Tools:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.tools.map((tool, i) => (
                              <span key={i} className="text-xs bg-[#253551]/10 dark:bg-blue-400/20 px-3 py-1 rounded-full border border-white/30 text-[#253551] dark:text-blue-300">
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
                          className="h-9 w-9 p-0 rounded-full hover:bg-[#253551]/10 dark:hover:bg-blue-400/10 text-[#253551] dark:text-blue-300 transition-all duration-300 transform hover:rotate-180"
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
                          className="h-9 w-9 p-0 rounded-full border border-white/30 hover:bg-[#253551]/10 dark:hover:bg-blue-400/10 text-[#253551] dark:text-blue-300 transition-all duration-300 transform hover:scale-110"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-[#253551]/60 dark:text-blue-200/60 truncate max-w-[70%] pl-11">
                        {step.description}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(step.id);
                        }}
                        className="h-9 w-9 p-0 rounded-full hover:bg-[#253551]/10 dark:hover:bg-blue-400/10 text-[#253551] dark:text-blue-300 transition-all duration-300 transform hover:rotate-180"
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
                    <div className="bg-white/50 dark:bg-[#253551]/40 p-2 rounded-full border border-white/30 shadow-md animate-bounce">
                      <ArrowDown className="w-5 h-5 text-[#253551] dark:text-blue-300" />
                    </div>
                    ) : (
                      <div className="bg-white/50 dark:bg-[#253551]/40 p-2 rounded-full border border-white/30 shadow-md animate-pulse">
                        <ArrowRight className="w-5 h-5 text-[#253551] dark:text-blue-300" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {steps.length === 0 && (
              <div className="flex flex-col items-center justify-center text-[#253551]/60 dark:text-blue-200/60 p-10 w-full h-72 border border-white/50 border-dashed rounded-2xl bg-white/30 dark:bg-[#253551]/20 backdrop-blur-md">
                <div className="bg-[#253551]/10 dark:bg-blue-400/20 p-4 rounded-full mb-4 border border-white/30 shadow-inner animate-pulse">
                  <Sparkles className="w-12 h-12 text-[#253551] dark:text-blue-300" />
                </div>
                <p className="text-center text-base font-medium">Describe your automation idea in the chat</p>
                <p className="text-center text-sm mt-2">Your workflow visualization will appear here</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-6 rounded-full px-4 border border-white/30 bg-white/50 dark:bg-[#253551]/30 hover:bg-[#253551]/10 dark:hover:bg-blue-400/10 transition-all duration-300 transform hover:scale-105 text-[#253551] dark:text-blue-200 shadow-md hover:shadow-blue-200/30"
                >
                  <ArrowDown className="h-4 w-4 mr-2 animate-bounce" /> Start with AI Chat
                </Button>
              </div>
            )}
          </div>
        </div>
  
        {/* Detailed step dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md max-w-[90vw] p-6 bg-white/80 dark:bg-[#253551]/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-xl">
            {selectedStep && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between text-lg text-[#253551] dark:text-blue-100">
                    <span className="pr-2">{selectedStep.title}</span>
                    {selectedStep.complexity && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(selectedStep.complexity)} flex-shrink-0 backdrop-blur-sm`}>
                        {selectedStep.complexity}
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-2 text-[#253551]/70 dark:text-blue-200/70">
                    {selectedStep.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {selectedStep.tools && selectedStep.tools.length > 0 && (
                    <div className="bg-white/60 dark:bg-[#253551]/60 p-4 rounded-lg border border-white/50 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-blue-200/30 transform hover:scale-[1.01]">
                      <h4 className="text-sm font-medium mb-2 flex items-center text-[#253551] dark:text-blue-100">
                        <Info className="h-4 w-4 mr-2 text-[#253551] dark:text-blue-300" /> Recommended Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStep.tools.map((tool, i) => (
                          <span 
                            key={i} 
                            className="text-sm bg-[#253551]/10 dark:bg-blue-400/20 px-3 py-1 rounded-full border border-white/30 text-[#253551] dark:text-blue-300 transition-all duration-300 hover:bg-[#253551]/20 dark:hover:bg-blue-400/30 transform hover:scale-105 cursor-default"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white/60 dark:bg-[#253551]/60 p-4 rounded-lg border border-white/50 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-blue-200/30 transform hover:scale-[1.01]">
                    <h4 className="text-sm font-medium mb-2 flex items-center text-[#253551] dark:text-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#253551] dark:text-blue-300 mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Implementation Notes
                    </h4>
                    <p className="text-sm text-[#253551]/70 dark:text-blue-200/70">
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
  
        {/* Animated decorative elements */}
        <div className="absolute bottom-5 right-5 w-24 h-24 rounded-full bg-blue-200/10 dark:bg-blue-400/5 animate-pulse pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-blue-300/10 dark:bg-blue-500/5 animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
      </Card>
    );
  }