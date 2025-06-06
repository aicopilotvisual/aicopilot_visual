"use client";

import { Bot, Sparkles, Share2, Download, Moon, Sun, ArrowLeft, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { AutomationStep } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  hasContent: boolean;
  onNewFlow: () => void;
  automationSteps: AutomationStep[];
}

export default function Navbar({ hasContent, onNewFlow, automationSteps }: NavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // const handleContactClick = () => {
  //   window.open("", "_blank");
  // };

  const handleShareClick = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to share",
        description: "Create a workflow first before sharing.",
        className: "bg-blue-50",
      });
      return;
    }
    
    const shareUrl = "https://mechevo-io-613v.vercel.app/";
    
    if (navigator.share) {
      navigator.share({
        title: 'Copilot Workflow',
        text: 'Check out this automation workflow I created!',
        url: shareUrl,
      })
      .catch((error) => toast({
        title: "Sharing failed",
        description: "Could not share this workflow.",
        className: "bg-blue-50",
      }));
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast({
          title: "Link copied!",
          description: "Workflow URL copied to clipboard.",
          className: "bg-blue-50",
        }))
        .catch(() => toast({
          title: "Copy failed",
          description: "Could not copy the URL to clipboard.",
          className: "bg-blue-50",
        }));
    }
  };

  const handleJsonExport = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to export",
        description: "Create a workflow first before exporting.",
        variant: "destructive",
        className: "bg-blue-50"
      });
      return;
    }
    
    // Create a Make-compatible JSON export format
    const makeExportData = {
      name: "AI Copilot Workflow",
      flow: automationSteps.map((step, index) => {
        return {
          id: index + 1,
          module: step.module || "custom:Module",
          version: step.version || 1,
          parameters: step.parameters || {},
          mapper: step.mapper || {},
          metadata: {
            designer: {
              x: step.metadata?.designer?.x !== undefined ? step.metadata.designer.x : index * 300,
              y: step.metadata?.designer?.y !== undefined ? step.metadata.designer.y : 0,
              ...(step.metadata?.designer || {})
            },
            ...(step.metadata || {})
          }
        };
      }),
      metadata: {
        instant: false,
        version: 1,
        scenario: {
          roundtrips: 1,
          maxErrors: 3,
          autoCommit: true,
          autoCommitTriggerLast: true,
          sequential: false,
          confidential: false,
          dataloss: false,
          dlq: false,
          freshVariables: false
        },
        designer: {
          orphans: []
        },
        zone: "eu2.make.com",
        notes: [`AI Copilot generated workflow with ${automationSteps.length} steps`]
      }
    };
    
    const exportData = JSON.stringify(makeExportData, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'automation-workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your workflow has been exported as JSON compatible with Make.",
      className: "bg-blue-50"
    });
  };

  const handleDocumentExport = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to export",
        description: "Create a workflow first before exporting.",
        variant: "destructive",
        className: "bg-blue-50"
      });
      return;
    }
    
    // Create a document format that explains the workflow in human-readable format
    let documentContent = "# AI Copilot Workflow Documentation\n\n";
    documentContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    documentContent += `## Workflow Overview\n\n`;
    documentContent += `This workflow contains ${automationSteps.length} automation steps.\n\n`;
    
    // Add detailed information about each step
    documentContent += `## Step Details\n\n`;
    automationSteps.forEach((step, index) => {
      documentContent += `### Step ${index + 1}: ${step.module || "Custom Module"}\n\n`;
      documentContent += `- **Version:** ${step.version || 1}\n`;
      documentContent += `- **Description:** ${step.description || "No description provided"}\n\n`;
      
      if (step.parameters && Object.keys(step.parameters).length > 0) {
        documentContent += `#### Parameters:\n\n`;
        for (const [key, value] of Object.entries(step.parameters)) {
          documentContent += `- ${key}: ${JSON.stringify(value)}\n`;
        }
        documentContent += `\n`;
      }
      
      if (step.mapper && Object.keys(step.mapper).length > 0) {
        documentContent += `#### Mappings:\n\n`;
        for (const [key, value] of Object.entries(step.mapper)) {
          documentContent += `- ${key} → ${JSON.stringify(value)}\n`;
        }
        documentContent += `\n`;
      }
      
      documentContent += `---\n\n`;
    });
    
    // Add workflow execution notes
    documentContent += `## Execution Notes\n\n`;
    documentContent += `- Max Errors: 3\n`;
    documentContent += `- Auto Commit: Enabled\n`;
    documentContent += `- Sequential Execution: Disabled\n`;
    
    const blob = new Blob([documentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'automation-workflow-documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your workflow has been exported as a document.",
      className: "bg-blue-50"
    });
  };

  return (
    <nav className="border-b bg-white/10 backdrop-blur-xl w-full z-50 transition-all duration-300 shadow-lg hover:shadow-blue-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-[#253551]/10 p-2 rounded-full backdrop-blur-md border border-white/30 shadow-inner animate-pulse">
            <Bot className="h-8 w-8 text-[#253551] animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#253551] to-blue-400">
            AI Copilot
          </h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="hidden sm:flex bg-white/10 backdrop-blur-sm border border-white/30 text-[#253551] hover:bg-[#253551]/10 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex bg-white/20 backdrop-blur-sm border border-white/30 text-[#253551] hover:bg-[#253551]/10 transition-all duration-300 transform hover:scale-105" 
            onClick={handleShareClick}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex bg-white/20 backdrop-blur-sm border border-white/30 text-[#253551] hover:bg-[#253551]/10 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-xl">
              <DropdownMenuItem onClick={handleJsonExport} className="cursor-pointer hover:bg-[#253551]/10 transition-all duration-300">
                <Download className="h-4 w-4 mr-2 text-[#253551]" />
                JSON Format
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDocumentExport} className="cursor-pointer hover:bg-[#253551]/10 transition-all duration-300">
                <FileText className="h-4 w-4 mr-2 text-[#253551]" />
                Document Format
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={onNewFlow}
            className="bg-[#253551] hover:bg-[#253551]/90 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-300/30"
          >
            <Sparkles className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">New Flow</span>
          </Button>

          <Button 
            variant="secondary"
            // onClick={handleContactClick}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-300/30 transform hover:scale-105 transition-all duration-300 border border-blue-400/50 px-6 py-2"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </nav>
  );
}