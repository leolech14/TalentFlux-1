import { motion } from "framer-motion";
import { BarChart3, Eye, Users, Target, TrendingUp, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface JobPosting {
  id: string;
  title: string;
  views: number;
  applications: number;
  conversionRate: number;
  qualityScore: number;
  shares: number;
  daysActive: number;
  status: "active" | "paused" | "closed";
  performance: "excellent" | "good" | "needs-improvement";
}

const jobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior React Developer",
    views: 3420,
    applications: 156,
    conversionRate: 4.56,
    qualityScore: 92,
    shares: 45,
    daysActive: 7,
    status: "active",
    performance: "excellent"
  },
  {
    id: "2",
    title: "DevOps Engineer",
    views: 2180,
    applications: 67,
    conversionRate: 3.07,
    qualityScore: 78,
    shares: 23,
    daysActive: 14,
    status: "active",
    performance: "good"
  },
  {
    id: "3",
    title: "Product Manager",
    views: 890,
    applications: 12,
    conversionRate: 1.35,
    qualityScore: 45,
    shares: 8,
    daysActive: 21,
    status: "paused",
    performance: "needs-improvement"
  }
];

export function JobPerformanceWidget() {
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent": return "from-green-500 to-emerald-500";
      case "good": return "from-blue-500 to-cyan-500";
      case "needs-improvement": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "paused": return "bg-yellow-500/20 text-yellow-400";
      case "closed": return "bg-gray-500/20 text-gray-400";
      default: return "";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <BarChart3 className="w-4 h-4 text-orange-400" />
          </div>
          Job Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Active job postings performance
          </p>
          <Badge variant="secondary" className="text-xs">
            3 active jobs
          </Badge>
        </div>

        <div className="space-y-3">
          {jobPostings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-sm">{job.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                      {job.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {job.daysActive} days active
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold bg-gradient-to-r ${getPerformanceColor(job.performance)} bg-clip-text text-transparent`}>
                    {job.qualityScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">quality score</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center p-2 rounded bg-white/5">
                  <Eye className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                  <p className="text-xs font-medium">{formatNumber(job.views)}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
                <div className="text-center p-2 rounded bg-white/5">
                  <Users className="w-3 h-3 mx-auto mb-1 text-green-400" />
                  <p className="text-xs font-medium">{job.applications}</p>
                  <p className="text-xs text-muted-foreground">applied</p>
                </div>
                <div className="text-center p-2 rounded bg-white/5">
                  <Target className="w-3 h-3 mx-auto mb-1 text-purple-400" />
                  <p className="text-xs font-medium">{job.conversionRate}%</p>
                  <p className="text-xs text-muted-foreground">conversion</p>
                </div>
                <div className="text-center p-2 rounded bg-white/5">
                  <Share2 className="w-3 h-3 mx-auto mb-1 text-orange-400" />
                  <p className="text-xs font-medium">{job.shares}</p>
                  <p className="text-xs text-muted-foreground">shares</p>
                </div>
              </div>

              {job.performance === "needs-improvement" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 rounded bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                >
                  <p className="text-xs text-orange-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Consider updating job description or requirements
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Detailed Analytics
        </Button>
      </CardContent>
    </Card>
  );
} 