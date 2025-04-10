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

  const handleContactClick = () => {
    window.open("https://tally.so/r/3jzXG1", "_blank");
  };

  const handleShareClick = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to share",
        description: "Create a workflow first before sharing.",
      });
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: 'AI Copilot Workflow',
        text: 'Check out this automation workflow I created!',
        url: window.location.href,
      })
      .catch((error) => toast({
        title: "Sharing failed",
        description: "Could not share this workflow.",
      }));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast({
          title: "Link copied!",
          description: "Workflow URL copied to clipboard.",
        }))
        .catch(() => toast({
          title: "Copy failed",
          description: "Could not copy the URL to clipboard.",
        }));
    }
  };

  const handleJsonExport = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to export",
        description: "Create a workflow first before exporting.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a Make-compatible JSON export format
    const makeExportData = {
      name: "AI Copilot Workflow",
      flow: automationSteps.map((step, index) => {
        return {
          id: index + 1, // Make uses numeric IDs starting from 1
          module: step.module || "custom:Module",
          version: step.version || 1,
          parameters: step.parameters || {},
          mapper: step.mapper || {},
          metadata: {
            designer: {
              // Use existing designer metadata if available, otherwise set default positioning
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
    });
  };

  const handleDocumentExport = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to export",
        description: "Create a workflow first before exporting.",
        variant: "destructive",
        className:"bg-amber-50"
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
    });
  };

  return (
    <nav className="border-b bg-background/50 backdrop-blur-lg w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            Mechevo Copilot
          </h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="hidden sm:flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          {/* <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button> */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex" 
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
                className="hidden sm:flex"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-amber-50">
              <DropdownMenuItem onClick={handleJsonExport} className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                JSON Format
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDocumentExport} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Document Format
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={onNewFlow}>
            <Sparkles className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">New Flow</span>
          </Button>

          <Button 
            variant="secondary"
            onClick={handleContactClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-emerald-500 border-opacity-50 px-6 py-2"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </nav>
  );
}