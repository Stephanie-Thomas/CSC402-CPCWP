import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Leaderboard } from "./leaderboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Terminal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { retryFetchJSON } from "@/lib/retryFetch";


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
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
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

export function LeaderboardToggle() {
  const [activeTab, setActiveTab] = useState<"codeforces" | "leetcode">("codeforces");

  const { data: codeforcesData, isLoading: isLoadingCF, error: cfError } = useQuery<CodeforcesUser[]>({
    queryKey: ["/api/codeforces-leaderboard"],
    queryFn: () => retryFetchJSON(`${API_BASE_URL}api/codeforces-leaderboard`, 3, 2000),

    refetchInterval: 120000, // 2 minutes
  });

  const { data: leetcodeData, isLoading: isLoadingLC, error: lcError } = useQuery<LeetCodeUser[]>({
    queryKey: ["/api/leetcode-leaderboard"],
    queryFn: () => retryFetchJSON(`${API_BASE_URL}api/leetcode-leaderboard`, 3, 2000),

    refetchInterval: 120000, // 2 minutes
  });

  const renderError = (message: string) => (
    <Alert variant="destructive" className="mx-auto max-w-2xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-center">{message}</AlertDescription>
    </Alert>
  );

  const renderTabContent = () => {
    if (activeTab === "codeforces") {
      if (cfError) return renderError("Failed to load Codeforces leaderboard");
      if (isLoadingCF) return <LeaderboardSkeleton />;

      const users = (codeforcesData || [])
        .map(user => ({
          id: user.handle,
          username: user.handle,
          score: user.rating || 0,
          rank: user.rank,
          problemsSolved: 0,
        }))
        .sort((a, b) => b.score - a.score);

      return <Leaderboard title="Codeforces" users={users} />;
    }

    if (lcError) return renderError("Failed to load LeetCode leaderboard");
    if (isLoadingLC) return <LeaderboardSkeleton />;

    const users = (leetcodeData || [])
      .map(user => ({
        id: user.username,
        username: user.username,
        score: parseInt(user.contestRanking) || 0,
        rank: user.overallRanking,
        problemsSolved: user.totalSolved,
        contest: user.contestTitle,
      }))
      .sort((a, b) => {
        if (a.score === 0 && b.score === 0) return 0;
        if (a.score === 0) return 1;
        if (b.score === 0) return -1;
        return a.score - b.score;
      });

    return <Leaderboard title="LeetCode" users={users} />;
  };

  return (
    <div className="w-full">
      <div className="relative mb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => setActiveTab("codeforces")}
                className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === "codeforces" ? "bg-primary text-white shadow-md" : "bg-transparent text-gray-600 dark:text-gray-300"
                }`}
              >
                <Terminal className="h-5 w-5" />
                Codeforces
              </button>
              <button
                onClick={() => setActiveTab("leetcode")}
                className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === "leetcode" ? "bg-primary text-white shadow-md" : "bg-transparent text-gray-600 dark:text-gray-300"
                }`}
              >
                <Code className="h-5 w-5" />
                LeetCode
              </button>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 -translate-y-1/2 left-8 w-16 h-16 bg-primary/5 rounded-full blur-sm"></div>
          <div className="absolute -z-10 top-1/2 -translate-y-1/2 right-8 w-16 h-16 bg-primary/5 rounded-full blur-sm"></div>
        </div>
      </div>

      <div className="mt-6 px-4">{renderTabContent()}</div>
    </div>
  );
}
