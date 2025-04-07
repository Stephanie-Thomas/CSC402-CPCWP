import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Star, Award, Clock, Code, BookOpen, Bookmark, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface LeaderboardProps {
  title: string;
  users: {
    id: string;
    username: string;
    score: number;
    rank: string;
    problemsSolved: number;
  }[];
}

function getRankIcon(index: number) {
  switch (index) {
    case 0:
      return (
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-30">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>
      );
    case 1:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return null;
  }
}

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
          className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 shadow-sm animate-pulse"
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

export function Leaderboard({ title, users }: LeaderboardProps) {
  if (!users) {
    return null;
  }

  // Highlight colors for ranks
  const getRankColor = (rank: string) => {
    const lowerRank = rank.toLowerCase();
    if (lowerRank.includes('expert') || lowerRank.includes('master')) return 'text-purple-600';
    if (lowerRank.includes('specialist')) return 'text-blue-600';
    if (lowerRank.includes('pupil')) return 'text-green-600';
    if (lowerRank.includes('newbie')) return 'text-gray-600';
    return 'text-gray-600';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden bg-white dark:bg-gray-800">
      <CardContent className="pt-5 pb-4 px-4 bg-white dark:bg-gray-800">
        <div className="space-y-3">
          {users.map((user, index) => (
            <HoverCard key={user.id}>
              <HoverCardTrigger asChild>
                <div
                  className="flex items-center gap-4 rounded-xl border p-4 transition-all cursor-pointer hover:shadow-md border-gray-100 dark:border-gray-700 hover:border-primary/20 bg-white dark:bg-gray-800"
                >
                  <div className="flex h-9 w-9 items-center justify-center">
                    {getRankIcon(index) || (
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-primary transition-colors">
                        {user.username}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`hidden xs:inline-flex text-[10px] py-0 h-4 px-1.5 ${getRankColor(user.rank)}`}
                      >
                        {user.rank}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {title === "LeetCode" ? (
                        <>{user.problemsSolved} problems solved</>
                      ) : (
                        <>Rating: {user.score}</>
                      )}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.score}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                  </div>
                </div>
              </HoverCardTrigger>
              
              <HoverCardContent 
                align="center"
                sideOffset={5}
                className="w-44 data-[state=open]:animate-in z-50 shadow-lg border-gray-200 dark:border-gray-700 p-0 overflow-hidden"
              >
                <div className="p-4 bg-white dark:bg-gray-800">
                  <a 
                    href={title === "Codeforces" 
                      ? `https://codeforces.com/profile/${user.username}`
                      : `https://leetcode.com/${user.username}`
                    } 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2 rounded-lg text-primary hover:bg-primary/5 dark:hover:bg-primary/20 transition-colors font-medium text-sm"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Profile
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}