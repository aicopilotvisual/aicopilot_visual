"use client";

import { Bot, Sparkles, Share2, Download, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ClientButtonsProps {
  onNewFlow?: () => void;
  hasContent?: boolean;
}

export default function ClientButtons({ onNewFlow, hasContent = false }: ClientButtonsProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleShareClick = async () => {
    if (!hasContent) {
      toast({
        title: "Nothing to share",
        description: "Create a workflow first before sharing.",
      });
      return;
    }

    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI Copilot Workflow',
          text: 'Check out this automation workflow I created!',
          url: window.location.href,
        });
        toast({
          title: "Shared successfully",
          description: "Your workflow has been shared.",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Workflow URL copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Could not share this workflow.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleExportClick = () => {
    if (!hasContent) {
      toast({
        title: "Nothing to export",
        description: "Create a workflow first before exporting.",
      });
      return;
    }
    
    setIsExporting(true);
    
    // This is just a placeholder - in your real implementation,
    // you would actually export the data
    setTimeout(() => {
      toast({
        title: "Export successful",
        description: "Your workflow has been exported.",
      });
      setIsExporting(false);
    }, 1000);
  };

  return (
    <>
      {/* <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button> */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShareClick}
        disabled={isSharing}
        className="hidden sm:flex"
      >
        <Share2 className="h-4 w-4 mr-2" />
        {isSharing ? "Sharing..." : "Share"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExportClick}
        disabled={isExporting}
        className="hidden sm:flex"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? "Exporting..." : "Export"}
      </Button>
      <Button onClick={onNewFlow}>
        <Sparkles className="h-4 w-4 mr-2" />
        New Flow
      </Button>
    </>
  );
}