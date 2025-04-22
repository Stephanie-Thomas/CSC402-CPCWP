import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Code, Mail, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import RegisterForm from "@/components/RegisterForm";

export function Navbar() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [location] = useLocation();
  const isDisplayPage = location === "/display";

  return (
    <nav className="sticky top-0 z-50 w-full border-b shadow-sm bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/90">
      <div className="container mx-auto px-4 h-16">
        {isDisplayPage ? (
          <div className="h-full flex items-center">
            <div className="w-full max-w-6xl mx-auto flex items-center">
              {/* Left section */}
              <div className="w-10">
                <Link href="/">
                  <div className="rounded-full bg-white shadow-sm hover:shadow-md transition-all transform hover:scale-105 flex items-center justify-center w-10 h-10 p-1">
                    <Avatar className="h-8 w-8 cursor-pointer aspect-square">
                      <AvatarImage src="wcu-cpc-logo.png" alt="WCU CPC Logo" className="object-cover" />
                      <AvatarFallback>!</AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
              </div>
              
              {/* Center section */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-white" />
                  <span className="font-extrabold text-3xl text-white tracking-wider">
                    LEADERBOARD
                  </span>
                </div>
              </div>
              
              {/* Right section */}
              <div className="w-10">
                <ThemeToggle />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center">
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
              {/* Left section */}
              <div className="flex items-center gap-4 md:gap-6">
                <Link href="/">
                  <div className="rounded-full bg-white shadow-sm hover:shadow-md transition-all transform hover:scale-105 flex items-center justify-center w-10 h-10 p-1">
                    <Avatar className="h-8 w-8 cursor-pointer aspect-square">
                      <AvatarImage src="wcu-cpc-logo.png" alt="WCU CPC Logo" className="object-cover" />
                      <AvatarFallback>WCU</AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-flex h-10 items-center font-bold text-white text-lg">
                    WCU Competitive Programming Club
                  </span>
                  <span className="md:hidden inline-flex h-10 items-center font-bold text-white text-lg">
                    WCU CPC
                  </span>
                </div>
              </div>

              {/* Right section, CPC Discord Link Here */} 
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 hover:text-white h-10 w-10"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="h-6 w-6"
                    >
                      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                    </svg>
                  </Button>
                </a>
                <Link href="/display">
                  <Button
                    variant="secondary"
                    className="shadow-sm bg-white/90 hover:bg-white text-primary font-medium"
                  >
                    Leaderboard View
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" className="shadow-sm font-medium flex gap-2">
                      <Mail className="h-4 w-4" />
                      Join Us
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    {isSubmitted ? (
                      <div className="space-y-3 py-2">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-green-600 dark:text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-center text-green-600 dark:text-green-400 font-medium">Thanks for signing up!</p>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                          You'll receive an email with next steps shortly.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-center text-gray-900 dark:text-gray-100">Join Our Club</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            Enter your info to sign up for the leaderboard
                          </p>
                        </div>
                        <RegisterForm onSuccess={() => setIsSubmitted(true)} />
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 text-sm text-center">
                          <span className="text-gray-500 dark:text-gray-400">WCU Alumni?</span>{" "}
                          <span
                            onClick={() => window.location.href = "/signup"}
                            className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary font-medium hover:underline transition-all cursor-pointer"
                          >
                            Join here
                          </span>
                        </div>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}