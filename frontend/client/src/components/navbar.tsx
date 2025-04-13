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
      <div className="container h-16 px-4">
        {isDisplayPage ? (
          <div className="flex justify-between items-center h-full">
            <div className="w-10">
              <Link href="/">
                <div className="rounded-full bg-white shadow-sm hover:shadow-md transition-all transform hover:scale-105 flex items-center justify-center w-10 h-10 p-1">
                  <Avatar className="h-8 w-8 cursor-pointer aspect-square">
                    <AvatarImage src="wcu-cpc-logo.png" alt="WCU CPC Logo" className="object-cover" />
                    <AvatarFallback>WCU</AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2">
                <Code className="h-6 w-6 text-white" />
                <span className="font-extrabold text-2xl text-white tracking-wider">
                  LEADERBOARD
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between h-full">
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

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="https://ramconnect.wcupa.edu/cpc/home/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 hover:text-white"
                >
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
              <Link href="/display">
                <Button
                  variant="secondary"
                  className="shadow-sm bg-white/90 hover:bg-white text-primary font-medium"
                >
                  Display View
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="shadow-sm font-medium flex gap-2">
                    <Mail className="h-4 w-4" />
                    Join Us
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-4 rounded-xl shadow-lg border-primary/20">
                  {isSubmitted ? (
                    <div className="space-y-3 py-2">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-center text-green-600 font-medium">Thanks for signing up!</p>
                      <p className="text-center text-sm text-gray-500">
                        You'll receive an email with next steps shortly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-center">Join Our Club</h3>
                        <p className="text-sm text-gray-500 text-center">
                          Enter your info to sign up for the leaderboard
                        </p>
                      </div>
                      <RegisterForm onSuccess={() => setIsSubmitted(true)} />
                      <div className="mt-4 pt-3 border-t text-sm text-center">
                        <span className="text-gray-500">WCU Alumni?</span>{" "}
                        <span
                          onClick={() => window.location.href = "/"}
                          className="text-primary font-medium hover:underline transition-all cursor-pointer"
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
        )}
      </div>
    </nav>
  );
}
