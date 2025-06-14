import { motion } from "framer-motion";
import { Sparkles, User, Mail, Phone, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  matchScore: number;
  skills: string[];
  experience: string;
  availability: "immediate" | "2 weeks" | "1 month";
  aiInsight: string;
}

const topCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior React Developer",
    avatar: "/avatars/sarah.jpg",
    matchScore: 95,
    skills: ["React", "TypeScript", "Node.js"],
    experience: "7 years",
    availability: "immediate",
    aiInsight: "Perfect cultural fit, strong leadership potential"
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Full Stack Engineer",
    avatar: "/avatars/michael.jpg",
    matchScore: 88,
    skills: ["Vue.js", "Python", "AWS"],
    experience: "5 years",
    availability: "2 weeks",
    aiInsight: "Excellent problem solver, startup experience"
  },
  {
    id: "3",
    name: "Emily Johnson",
    role: "Frontend Architect",
    avatar: "/avatars/emily.jpg",
    matchScore: 85,
    skills: ["React", "GraphQL", "Design Systems"],
    experience: "8 years",
    availability: "1 month",
    aiInsight: "Strong technical skills, mentorship experience"
  }
];

export function CandidateMatchingWidget() {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "immediate": return "bg-green-500/20 text-green-400";
      case "2 weeks": return "bg-yellow-500/20 text-yellow-400";
      case "1 month": return "bg-orange-500/20 text-orange-400";
      default: return "";
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-500";
    if (score >= 80) return "from-blue-500 to-cyan-500";
    return "from-yellow-500 to-orange-500";
  };

  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          AI Candidate Matching
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Top matches for Senior Developer role
          </p>
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        <div className="space-y-3">
          {topCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarImage src={candidate.avatar} />
                  <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-medium text-sm">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground">{candidate.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`text-sm font-bold bg-gradient-to-r ${getMatchColor(candidate.matchScore)} bg-clip-text text-transparent`}>
                          {candidate.matchScore}%
                        </div>
                        <span className="text-xs text-muted-foreground">match</span>
                      </div>
                      <Badge className={`text-xs ${getAvailabilityColor(candidate.availability)}`}>
                        {candidate.availability}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{candidate.experience}</span>
                    <span>•</span>
                    <span>{candidate.skills.slice(0, 2).join(", ")}</span>
                  </div>

                  <div className="p-2 rounded bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <p className="text-xs text-purple-300">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {candidate.aiInsight}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Mail className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Phone className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          View All Matches
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
} 