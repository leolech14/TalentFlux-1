import { motion } from "framer-motion";
import { Target, TrendingUp, Briefcase, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WidgetProps } from "@/lib/WidgetTypes";

export function JobMatchWidget({ className }: WidgetProps) {
  const matches = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      match: 92,
      salary: "$120k - $150k",
      skills: ["React", "TypeScript", "Node.js"]
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      match: 87,
      salary: "$100k - $130k",
      skills: ["Vue.js", "Python", "AWS"]
    }
  ];

  const topMatch = matches[0];

  return (
    <motion.div
      className={`col-span-6 lg:col-span-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full border border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Top Job Matches</CardTitle>
            <Target className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Top Match Highlight */}
          <div className="p-3 border border-primary/20 bg-primary/5 dark:bg-primary/10 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">{topMatch.title}</h4>
                <p className="text-xs text-muted-foreground">{topMatch.company}</p>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                {topMatch.match}% match
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{topMatch.location}</span>
              </div>
              <span>{topMatch.salary}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {topMatch.skills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {topMatch.skills.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{topMatch.skills.length - 2}
                </Badge>
              )}
            </div>
            <Button size="sm" className="w-full text-xs h-7">
              Apply Now
            </Button>
          </div>

          {/* Match Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Briefcase className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-lg font-semibold text-foreground">24</div>
              <div className="text-xs text-muted-foreground">New Matches</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
              <div className="text-lg font-semibold text-foreground">4.2</div>
              <div className="text-xs text-muted-foreground">Avg Match Score</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-border">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                View All
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}