"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('cta-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
          setIsVisible(true);
        }
      }
    };
    
    handleScroll(); // Check on initial load
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      setEmail("");
      setMessage("Thanks for subscribing!");
      setStatus("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to subscribe");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="cta-section" className="py-20 px-4 relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-[#253551]/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-[#253551]/5 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-white/70 backdrop-blur-lg p-10 rounded-2xl border border-white/50 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#253551]">
            Ready to Transform Your Workflows?
          </h2>
          <p className="text-xl text-[#253551]/80 mb-8 max-w-2xl mx-auto">
            We&apos;re helping businesses build their AI infrastructure—empowering them to automate operations effortlessly
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/80 backdrop-blur-sm border border-[#253551]/20 focus:border-[#253551]/50 focus:ring-2 focus:ring-[#253551]/30 shadow-inner text-[#253551] placeholder:text-[#253551]/50 transition-all duration-300"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 bg-[#253551]/90 backdrop-blur-sm text-white border border-[#253551]/50 hover:bg-[#253551] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Subscribing...</span>
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>
          
          {message && (
            <p className={`mt-4 p-2 rounded-md transition-all duration-500 ${
              status === "success" 
                ? "bg-green-100/50 backdrop-blur-sm text-green-700 border border-green-200" 
                : "bg-red-100/50 backdrop-blur-sm text-red-700 border border-red-200"
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}