import { motion } from "framer-motion";
import { Compass, ArrowRight, Star, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CareerNode {
  id: string;
  title: string;
  level: "current" | "next" | "future";
  yearsExperience: string;
  salaryRange: string;
  skills: string[];
  match: number;
}

const careerPaths: CareerNode[] = [
  {
    id: "1",
    title: "Junior Developer",
    level: "current",
    yearsExperience: "0-2 years",
    salaryRange: "$60k-$80k",
    skills: ["HTML", "CSS", "JavaScript"],
    match: 100
  },
  {
    id: "2",
    title: "Mid-Level Developer",
    level: "next",
    yearsExperience: "2-5 years",
    salaryRange: "$80k-$120k",
    skills: ["React", "Node.js", "Testing"],
    match: 75
  },
  {
    id: "3",
    title: "Senior Developer",
    level: "future",
    yearsExperience: "5-8 years",
    salaryRange: "$120k-$160k",
    skills: ["Architecture", "Leadership", "DevOps"],
    match: 45
  },
  {
    id: "4",
    title: "Tech Lead",
    level: "future",
    yearsExperience: "8+ years",
    salaryRange: "$150k-$200k",
    skills: ["Team Management", "Strategy", "Mentoring"],
    match: 30
  }
];

export function CareerPathWidget() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "current": return "from-green-500 to-emerald-500";
      case "next": return "from-blue-500 to-cyan-500";
      case "future": return "from-purple-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "current": return "bg-green-500/20 text-green-400";
      case "next": return "bg-blue-500/20 text-blue-400";
      case "future": return "bg-purple-500/20 text-purple-400";
      default: return "";
    }
  };

  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          Career Path Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">
          Your potential career progression based on current skills
        </p>

        <div className="space-y-2">
          {careerPaths.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {index < careerPaths.length - 1 && (
                <div className="absolute left-6 top-12 h-8 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
              )}
              
              <div
                className={`p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
                  selectedPath === node.id ? "ring-2 ring-purple-500/50" : ""
                }`}
                onClick={() => setSelectedPath(selectedPath === node.id ? null : node.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${getLevelColor(node.level)}`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{node.title}</h4>
                      <Badge className={`text-xs ${getLevelBadge(node.level)}`}>
                        {node.level === "current" ? "You are here" : 
                         node.level === "next" ? "Next step" : "Future goal"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {node.yearsExperience}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {node.salaryRange}
                      </span>
                    </div>

                    {selectedPath === node.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t border-white/10"
                      >
                        <p className="text-xs text-muted-foreground mb-2">Key skills needed:</p>
                        <div className="flex flex-wrap gap-1">
                          {node.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${node.match}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{node.match}% match</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
          <Star className="w-4 h-4 mr-2" />
          Get Personalized Roadmap
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
} 