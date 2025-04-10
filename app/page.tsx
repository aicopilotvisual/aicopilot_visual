"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Testimonials from "@/components/landing/testimonials";
import CallToAction from "@/components/landing/call-to-action";
import Navbar from "@/components/landing/Navbar";

export default function LandingPage() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen relative">
      {/* Light background - completely replaced */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-amber-50 to-orange-100"></div>
      
      <div className="min-h-screen relative z-10">
        {/* Navigation - now using the separate Navbar component */}
        <Navbar />

        {/* Main content */}
        <div className="pt-16">
          <Hero onGetStarted={handleGetStarted} />
          <Features />
          <Testimonials />
          <CallToAction />
        </div>
      </div>
    </main>
  );
}