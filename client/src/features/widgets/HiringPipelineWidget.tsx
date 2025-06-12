import { motion } from "framer-motion";
import { GitBranch, TrendingDown, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PipelineStage {
  id: string;
  name: string;
  candidates: number;
  conversionRate: number;
  avgDays: number;
  trend: "up" | "down" | "stable";
  bottleneck?: boolean;
}

const pipelineStages: PipelineStage[] = [
  {
    id: "1",
    name: "Applications",
    candidates: 245,
    conversionRate: 100,
    avgDays: 0,
    trend: "up"
  },
  {
    id: "2",
    name: "Screening",
    candidates: 156,
    conversionRate: 63.7,
    avgDays: 2.3,
    trend: "stable"
  },
  {
    id: "3",
    name: "Technical Interview",
    candidates: 48,
    conversionRate: 30.8,
    avgDays: 5.7,
    trend: "down",
    bottleneck: true
  },
  {
    id: "4",
    name: "Final Interview",
    candidates: 22,
    conversionRate: 45.8,
    avgDays: 3.2,
    trend: "up"
  },
  {
    id: "5",
    name: "Offer",
    candidates: 8,
    conversionRate: 36.4,
    avgDays: 1.5,
    trend: "stable"
  }
];

export function HiringPipelineWidget() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-3 h-3 text-green-400" />;
      case "down": return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <div className="w-3 h-3 rounded-full bg-yellow-400" />;
    }
  };

  const getStageColor = (index: number, total: number) => {
    const progress = (index + 1) / total;
    if (progress <= 0.2) return "from-blue-500 to-cyan-500";
    if (progress <= 0.4) return "from-cyan-500 to-green-500";
    if (progress <= 0.6) return "from-green-500 to-yellow-500";
    if (progress <= 0.8) return "from-yellow-500 to-orange-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <GitBranch className="w-4 h-4 text-cyan-400" />
          </div>
          Hiring Pipeline Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            Current pipeline performance
          </p>
          <Badge variant="secondary" className="text-xs">
            Last 30 days
          </Badge>
        </div>

        <div className="space-y-3">
          {pipelineStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {index < pipelineStages.length - 1 && (
                <div className="absolute left-4 top-10 h-6 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
              )}

              <div className={`p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${
                stage.bottleneck ? "ring-2 ring-red-500/50" : ""
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full bg-gradient-to-br ${getStageColor(index, pipelineStages.length)}`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{stage.name}</h4>
                        {stage.bottleneck && (
                          <Badge className="text-xs bg-red-500/20 text-red-400">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Bottleneck
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(stage.trend)}
                        <span className="text-sm font-medium">{stage.candidates}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Conversion Rate</p>
                        <div className="flex items-center gap-2">
                          <Progress value={stage.conversionRate} className="h-1.5 flex-1" />
                          <span className="font-medium">{stage.conversionRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Avg. Time</p>
                        <p className="font-medium">{stage.avgDays} days</p>
                      </div>
                    </div>

                    {stage.bottleneck && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20"
                      >
                        <p className="text-xs text-red-300">
                          Low conversion rate detected. Consider reviewing interview process or criteria.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          Optimize Pipeline
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
} 