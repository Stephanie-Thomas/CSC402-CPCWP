import { Navbar } from "@/components/navbar";
import { LeaderboardToggle } from "@/components/leaderboard-toggle";
import { Trophy, Users, Code } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pb-16 pt-10">
        {/* Background decorative elements */}
        <div className="absolute -z-10 top-24 -left-24 w-72 h-72 bg-primary/5 rounded-full"></div>
        <div className="absolute -z-10 top-36 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
              WCU Competitive Programming
            </h1>
            
            <p className="mb-10 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track your progress, compete with peers, and improve your coding skills through friendly competition.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">50+</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active Members</span>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">200+</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Problems Solved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leaderboard Section */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboards</h2>
            </div>
          </div>
          
          <LeaderboardToggle />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 p-1 shadow-sm">
                <img src="wcu-cpc-logo.png" alt="WCU CPC Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-gray-800 dark:text-white">WCU Competitive Programming Club</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} WCU Competitive Programming Club. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}