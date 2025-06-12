import { motion } from "framer-motion";
import { DollarSign, TrendingDown, Users, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WidgetProps } from "@/lib/WidgetTypes";

export function CostPerHireWidget({ className }: WidgetProps) {
  const costData = {
    currentCost: 4850,
    previousCost: 5200,
    totalHires: 12,
    avgTimeToHire: 18,
    breakdown: [
      { category: "Job Postings", cost: 1200, percentage: 25 },
      { category: "Recruiting Tools", cost: 1800, percentage: 37 },
      { category: "Interview Process", cost: 950, percentage: 20 },
      { category: "Background Checks", cost: 900, percentage: 18 }
    ]
  };

  const savings = costData.previousCost - costData.currentCost;
  const savingsPercentage = ((savings / costData.previousCost) * 100).toFixed(1);

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
            <CardTitle className="text-lg font-semibold text-foreground">Cost Per Hire</CardTitle>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Metric */}
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              ${costData.currentCost.toLocaleString()}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ${savings} saved (-{savingsPercentage}%)
              </span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Users className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-xl font-semibold text-foreground">{costData.totalHires}</div>
              <div className="text-xs text-muted-foreground">Hires This Month</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Calculator className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <div className="text-xl font-semibold text-foreground">{costData.avgTimeToHire}d</div>
              <div className="text-xs text-muted-foreground">Avg Time to Hire</div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Cost Breakdown</h4>
            {costData.breakdown.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {item.percentage}%
                  </Badge>
                  <span className="font-medium text-foreground">${item.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}