import { motion } from "framer-motion";
import { Users, Star, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  skills: string[];
  avatar?: string;
}

const topCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    rating: 4.8,
    skills: ["React", "Node.js", "AWS"]
  },
  {
    id: "2",
    name: "Jordan Lee",
    role: "Product Designer",
    location: "New York, NY",
    rating: 4.9,
    skills: ["Figma", "UI/UX", "Prototyping"]
  },
  {
    id: "3",
    name: "Sam Chen",
    role: "Data Scientist",
    location: "Seattle, WA",
    rating: 4.7,
    skills: ["Python", "ML", "TensorFlow"]
  }
];

export function TalentPoolWidget() {
  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          Top Talent Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCandidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{candidate.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-muted-foreground">{candidate.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {candidate.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {candidate.location}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs py-0 px-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
} 