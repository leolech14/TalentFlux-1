import { motion } from "framer-motion";
import { TrendingUp, Users, UserCheck, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WidgetProps } from "@/lib/WidgetTypes";

export function HiringFunnelWidget({ className }: WidgetProps) {
  const funnelData = [
    { stage: "Applications", count: 124, percentage: 100, icon: Users, color: "text-blue-500" },
    { stage: "Screening", count: 89, percentage: 72, icon: Target, color: "text-cyan-500" },
    { stage: "Interviews", count: 34, percentage: 27, icon: Calendar, color: "text-purple-500" },
    { stage: "Offers", count: 8, percentage: 6, icon: UserCheck, color: "text-green-500" },
  ];

  const conversionRate = ((funnelData[3].count / funnelData[0].count) * 100).toFixed(1);

  return (
    <motion.div
      className={`col-span-6 lg:col-span-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="h-full border border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Hiring Funnel</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conversion Rate */}
          <div className="text-center p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Overall Conversion Rate</div>
          </div>

          {/* Funnel Stages */}
          <div className="space-y-3">
            {funnelData.map((stage, index) => (
              <motion.div
                key={stage.stage}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <stage.icon className={`w-4 h-4 ${stage.color}`} />
                    <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{stage.percentage}%</span>
                    <span className="text-sm font-semibold text-foreground">{stage.count}</span>
                  </div>
                </div>
                <Progress 
                  value={stage.percentage} 
                  className="h-2"
                />
              </motion.div>
            ))}
          </div>

          {/* Stage-to-Stage Conversion */}
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Stage Conversions</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-foreground">72%</div>
                <div className="text-muted-foreground">Screen Rate</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">38%</div>
                <div className="text-muted-foreground">Interview Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}