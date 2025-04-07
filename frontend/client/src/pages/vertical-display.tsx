import { Navbar } from "@/components/navbar";
import { Leaderboard } from "@/components/leaderboard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Terminal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CodeforcesUser = {
  handle: string;
  rating: number | null;
  rank: string;
};

type LeetCodeUser = {
  username: string;
  totalSolved: number;
  overallRanking: string;
  contestRanking: string;
  contestTitle: string | null;
};

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="pb-2">
        <Skeleton className="h-6 w-40 mx-auto" />
      </div>
      
      {/* Items skeleton */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse"
        >
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function VerticalDisplay() {
  // Fetch Codeforces data
  const { data: codeforcesData, isLoading: isLoadingCF, error: cfError } =
    useQuery<CodeforcesUser[]>({
      queryKey: ["/api/codeforces-leaderboard"],
    });

  // Fetch LeetCode data
  const { data: leetcodeData, isLoading: isLoadingLC, error: lcError } =
    useQuery<LeetCodeUser[]>({
      queryKey: ["/api/leetcode-leaderboard"],
    });

  const renderError = (message: string) => (
    <Alert variant="destructive" className="mx-auto max-w-2xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-center">{message}</AlertDescription>
    </Alert>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      
      <main className="container mx-auto p-4 min-h-[calc(100vh-4rem)]">
        {/* Decorative elements */}
        <div className="absolute -z-10 top-24 -left-24 w-72 h-72 bg-primary/5 rounded-full"></div>
        <div className="absolute -z-10 top-36 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 bottom-24 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <Terminal className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Codeforces</h2>
              </div>
            </div>
            
            {cfError ? (
              renderError("Failed to load Codeforces leaderboard")
            ) : isLoadingCF ? (
              <LeaderboardSkeleton />
            ) : (
              <Leaderboard
                title="Codeforces"
                users={(codeforcesData || []).map((user) => ({
                  id: user.handle,
                  username: user.handle,
                  score: user.rating || 0,
                  rank: user.rank,
                  problemsSolved: 0,
                }))}
              />
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <Code className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">LeetCode</h2>
              </div>
            </div>
            
            {lcError ? (
              renderError("Failed to load LeetCode leaderboard")
            ) : isLoadingLC ? (
              <LeaderboardSkeleton />
            ) : (
              <Leaderboard
                title="LeetCode"
                users={(leetcodeData || []).map((user) => ({
                  id: user.username,
                  username: user.username,
                  score: parseInt(user.contestRanking) || 0,
                  rank: user.overallRanking,
                  problemsSolved: user.totalSolved,
                }))}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} WCU Competitive Programming Club
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}