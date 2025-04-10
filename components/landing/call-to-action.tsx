"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Ready to Transform Your Workflows?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          We&apos;re helping businesses build their AI infrastructure—empowering them to automate operations effortlessly
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="px-6 shadow-primary hover:shadow-lg transition-all duration-300"
          >
            {loading ? "Subscribing..." : "Subscribe"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
        
        {message && (
          <p className={`mt-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}