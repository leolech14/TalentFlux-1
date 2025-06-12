import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Award, Target, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Skill {
  name: string;
  current: number;
  required: number;
  category: "technical" | "soft" | "domain";
  courses: number;
}

const skills: Skill[] = [
  { name: "React.js", current: 75, required: 90, category: "technical", courses: 12 },
  { name: "Leadership", current: 60, required: 80, category: "soft", courses: 8 },
  { name: "Cloud Architecture", current: 40, required: 85, category: "technical", courses: 15 },
  { name: "Communication", current: 85, required: 90, category: "soft", courses: 5 },
  { name: "Machine Learning", current: 30, required: 70, category: "domain", courses: 20 }
];

export function SkillGapWidget() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical": return "text-blue-400";
      case "soft": return "text-green-400";
      case "domain": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const getGapLevel = (current: number, required: number) => {
    const gap = required - current;
    if (gap <= 10) return { level: "Minor", color: "text-green-400" };
    if (gap <= 25) return { level: "Moderate", color: "text-yellow-400" };
    return { level: "Significant", color: "text-red-400" };
  };

  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          Skill Gap Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Skills to develop for your target roles
          </p>
          <Badge variant="secondary" className="text-xs">
            5 gaps identified
          </Badge>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {skills.map((skill, index) => {
            const gap = getGapLevel(skill.current, skill.required);
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      {skill.name}
                      <span className={`text-xs ${getCategoryColor(skill.category)}`}>
                        {skill.category}
                      </span>
                    </h4>
                    <p className={`text-xs ${gap.color} mt-1`}>
                      {gap.level} gap • {skill.required - skill.current}% to target
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3" />
                    {skill.courses} courses
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Current: {skill.current}%</span>
                    <span>Target: {skill.required}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={skill.current} className="h-2" />
                    <div 
                      className="absolute top-0 h-2 w-0.5 bg-red-400"
                      style={{ left: `${skill.required}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Award className="w-4 h-4 mr-2" />
          View Learning Paths
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
} 