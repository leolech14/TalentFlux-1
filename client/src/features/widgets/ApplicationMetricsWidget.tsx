import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

const metrics: Metric[] = [
  {
    label: "Total Applications",
    value: "1,234",
    change: 12.5,
    icon: Users,
    color: "from-blue-500 to-cyan-500"
  },
  {
    label: "Avg. Time to Hire",
    value: "14 days",
    change: -8.3,
    icon: Clock,
    color: "from-purple-500 to-pink-500"
  },
  {
    label: "Offer Acceptance",
    value: "87%",
    change: 5.2,
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500"
  }
];

export function ApplicationMetricsWidget() {
  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Application Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${metric.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(metric.change) * 5)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
} 