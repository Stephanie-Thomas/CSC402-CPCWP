// src/pages/vertical-display.tsx
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Leaderboard } from "@/components/leaderboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Terminal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

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
      <div className="pb-2">
        <Skeleton className="h-6 w-40 mx-auto" />
      </div>
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
  const [timer, setTimer] = useState(0); // Just initialize to 0

  // Timer countdown + ping backend at 120 seconds
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const remainder = 30 - (minutes % 30);
      const newTimer = remainder * 60 - seconds;
      setTimer(newTimer);

      if (newTimer === 120) {
        fetch(`${API_BASE_URL}api/codeforces-leaderboard`);
        fetch(`${API_BASE_URL}api/leetcode-leaderboard`);
      }
    };

    updateTimer(); // Initialize immediately on mount
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const { data: codeforcesData, isLoading: isLoadingCF, error: cfError } =
    useQuery<CodeforcesUser[]>({
      queryKey: ["/api/codeforces-leaderboard"],
      queryFn: async () => {
        const res = await fetch(`${API_BASE_URL}api/codeforces-leaderboard`);
        if (!res.ok) throw new Error("Failed to fetch Codeforces leaderboard");
        return res.json();
      },
      refetchInterval: 1800000, // 30 minutes
    });

  const { data: leetcodeData, isLoading: isLoadingLC, error: lcError } =
    useQuery<LeetCodeUser[]>({
      queryKey: ["/api/leetcode-leaderboard"],
      queryFn: async () => {
        const res = await fetch(`${API_BASE_URL}api/leetcode-leaderboard`);
        if (!res.ok) throw new Error("Failed to fetch LeetCode leaderboard");
        return res.json();
      },
      refetchInterval: 1800000, // 30 minutes
    });

  const renderError = (message: string) => (
    <Alert
      variant="destructive"
      className="mx-auto max-w-2xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-center">{message}</AlertDescription>
    </Alert>
  );

  const processedCodeforces =
    codeforcesData?.map((user) => ({
      id: user.handle,
      username: user.handle,
      score: user.rating || 0,
      rank: user.rank,
      problemsSolved: 0,
    }))?.sort((a, b) => b.score - a.score) || [];

  const processedLeetCode =
    leetcodeData?.map((user) => ({
      id: user.username,
      username: user.username,
      score: parseInt(user.contestRanking) || 0,
      rank: user.overallRanking,
      problemsSolved: user.totalSolved,
      contest: user.contestTitle,
    }))?.sort((a, b) => {
      if (a.score === 0 && b.score === 0) return 0;
      if (a.score === 0) return 1;
      if (b.score === 0) return -1;
      return a.score - b.score;
    }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="container mx-auto p-4 min-h-[calc(100vh-4rem)]">
        {/* Decorative background elements */}
        <div className="absolute -z-10 top-24 -left-24 w-72 h-72 bg-primary/5 rounded-full"></div>
        <div className="absolute -z-10 top-36 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 bottom-24 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="text-center font-mono text-sm text-gray-600 dark:text-gray-400 mb-6">
          Refreshing leaderboard in: <strong>{formatTime(timer)}</strong>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <Terminal className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Codeforces
                </h2>
              </div>
            </div>
            {cfError ? (
              renderError("Failed to load Codeforces leaderboard")
            ) : isLoadingCF ? (
              <LeaderboardSkeleton />
            ) : (
              <Leaderboard title="Codeforces" users={processedCodeforces} />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <Code className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  LeetCode
                </h2>
              </div>
            </div>
            {lcError ? (
              renderError("Failed to load LeetCode leaderboard")
            ) : isLoadingLC ? (
              <LeaderboardSkeleton />
            ) : (
              <Leaderboard title="LeetCode" users={processedLeetCode} />
            )}
          </div>
        </div>
      </main>
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
