"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, ArrowRight, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-lg" 
        : "bg-white/80 border-b-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group">
          <div className="bg-[#253551]/20 p-2 rounded-full backdrop-blur-md border border-white/30 shadow-md transform group-hover:scale-110 transition-transform duration-300">
            <Bot className="h-6 w-6 text-[#253551]" />
          </div>
          <h1 className="text-2xl font-bold text-[#253551] transition-all duration-300 group-hover:tracking-wide">
            Mechevo Copilot
          </h1>
        </div>
        <div className="flex items-center">
          {user ? (
            <>
              <Button 
                onClick={handleGetStarted} 
                className="mr-4 bg-[#253551]/80 backdrop-blur-sm text-white hover:bg-[#253551] shadow-md hover:shadow-lg border border-[#253551]/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-[#253551]/20 hover:border-[#253551]/50 transition-all duration-300 p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                      <AvatarFallback className="bg-[#253551]/10 text-[#253551]">
                        {user.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border border-[#253551]/20 shadow-lg">
                  <DropdownMenuItem 
                    className="hover:bg-[#253551]/10 text-[#253551] transition-all duration-200" 
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              asChild 
              className="bg-[#253551]/90 backdrop-blur-sm hover:bg-[#253551] text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-[#253551]/50 px-6 py-2"
            >
              <Link href="/sign-in">
                Join In!
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}