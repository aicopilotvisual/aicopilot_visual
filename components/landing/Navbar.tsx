"use client";

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
  
  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="border-b-2 border-border bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Mechevo Copilot
          </h1>
        </div>
        <div className="flex items-center">
          {user ? (
            <>
              <Button 
                onClick={handleGetStarted} 
                className="mr-4 shadow-primary hover:shadow-lg transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-5 w-5 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                      <AvatarFallback>
                        {user.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem className="bg-white" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span >Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              asChild 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-emerald-500 border-opacity-50 px-6 py-2"
            >
              <Link href="/sign-in">
                Join In!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}