import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Calendar, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WidgetProps } from "@/lib/WidgetTypes";

export function ApplicationTrackingWidget({ className }: WidgetProps) {
  const applications = [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Senior React Developer",
      status: "interview",
      stage: "Technical Interview",
      progress: 75,
      appliedDate: "5 days ago",
      nextAction: "Prepare for final round"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Engineer",
      status: "pending",
      stage: "Application Review",
      progress: 25,
      appliedDate: "2 days ago",
      nextAction: "Wait for response"
    }
  ];

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
    interview: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    accepted: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" }
  };

  const stats = {
    total: 12,
    pending: 6,
    interviews: 3,
    offers: 1
  };

  return (
    <motion.div
      className={`col-span-6 lg:col-span-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full border border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Application Tracking</CardTitle>
            <Send className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Applied</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-foreground">{stats.interviews}</div>
              <div className="text-xs text-muted-foreground">Interviews</div>
            </div>
          </div>

          {/* Active Applications */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Active Applications</h4>
            {applications.map((app) => {
              const config = statusConfig[app.status as keyof typeof statusConfig];
              return (
                <motion.div
                  key={app.id}
                  className="p-3 border border-border rounded-lg bg-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground text-sm">{app.company}</h5>
                      <p className="text-xs text-muted-foreground">{app.position}</p>
                    </div>
                    <Badge className={`${config.bg} ${config.color} border-0`}>
                      <config.icon className="w-3 h-3 mr-1" />
                      {app.stage}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-1.5" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Applied {app.appliedDate}</span>
                      <span className="text-primary font-medium">{app.nextAction}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}