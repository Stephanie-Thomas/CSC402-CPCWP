import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Trophy, Users, Calendar, Newspaper, User } from "lucide-react";
import { LeaderboardToggle } from "@/components/leaderboard-toggle";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface NewsBlock {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  { name: "Mary Bauman", role: "President", image: "/team/mary-bauman.png" },
  { name: "Heather Cassel", role: "Vice-President", image: "/team/heather-cassel.jpeg" },
  { name: "Christopher Calixte", role: "Treasurer", image: "/team/no-image.png" },
  { name: "Nolan Prochnau", role: "Secretary", image: "/team/no-image.png" },
  { name: "Linh Ngo", role: "Advisor", image: "/team/no-image.png" },
  { name: "Catherine Emerick", role: "Leadership Consultant", image: "/team/catherine-emerick.jpeg" }
];

const initialNews: NewsBlock[] = [
  { id: "3", title: "3rd Place at PACISE", content: "Team Byte Me earned 3rd place at the PACISE coding competition this weekend!", date: "2025-04-06", image: "/news/4_6_25.jpeg" },
  { id: "2", title: "2nd Place at ICPC", content: "West Chester University's Byte Me won 2nd place at the International Collegiate Programming Contest (ICPC) Wilkes University Division 1 Site!", date: "2024-11-16", image: "/news/11_16_24.jpeg" },
  { id: "1", title: "1st Place at CCSC Eastern", content: "Team Byte Me won 1st place at the CCSC Eastern Programming Contest at Saint Mary's University!", date: "2024-10-19", image: "/news/10_19_24.jpeg" }
];

export default function Home() {
  const [news] = useState<NewsBlock[]>(initialNews);
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}api/member-count`)
      .then(res => res.json())
      .then(data => setMemberCount(data.count))
      .catch(err => {
        console.error("Failed to fetch member count:", err);
        setMemberCount(null);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="container mx-auto px-4 py-8">

        {/* Header Image */}
        <div className="flex items-center justify-center mb-10">
          <img src="/wcu-cpc-logo.png" alt="WCU CPC Logo" className="h-64 w-auto mx-auto" />
        </div>

        {/* About Us Info */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The goal of the competitive programming club is to increase programming skills and prepare students to win programming competitions. We primarily use Python and Java during practice and for competitions. Students of all skill levels are encouraged to participate. The skills learned in this club will prove to be very useful for solving coding interview-type questions, programming assignments, or any kind of programming in general.
          </p>
        </div>

        {/* Leaderboard Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboards</h2>
              </div>
            </div>
            <LeaderboardToggle />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {memberCount !== null ? `${memberCount}+` : "Loading..."}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active Members</span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">200+</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Problems Solved</span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">73</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Events</span>
          </div>
        </div>

        {/* Team Section */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Our Team</h2>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-center items-center">
              <div className="flex justify-between w-full max-w-6xl flex-wrap gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.name} className="w-40 hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
                    <CardContent className="p-3 text-center">
                      <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">
              <Newspaper className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Latest News</h2>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-wrap justify-between">
              {news.map((item) => (
                <Card key={item.id} className="w-full md:w-64 lg:w-96 mb-4 md:mb-0 overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
                  <CardContent className="p-4">
                    {item.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <div className="w-full relative pb-12" style={{ paddingBottom: "50%" }}>
                          <img src={item.image} alt={item.title} className="absolute top-0 left-0 w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
