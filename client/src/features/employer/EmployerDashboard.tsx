import { motion } from "framer-motion";
import { Bell, Briefcase, Users, CalendarCheck, Clock, Plus, UserPlus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";

interface EmployerDashboardProps {
  user: User;
}

export function EmployerDashboard({ user }: EmployerDashboardProps) {
  const stats = [
    { label: "Open Positions", value: "8", change: "+2 this month", icon: Briefcase, color: "text-primary" },
    { label: "Applications", value: "124", change: "+23 this week", icon: Users, color: "text-cyan-500" },
    { label: "Interviews", value: "15", change: "5 scheduled today", icon: CalendarCheck, color: "text-purple-500" },
    { label: "Time to Hire", value: "18d", change: "-3d from last month", icon: Clock, color: "text-green-500" },
  ];

  const activeJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      applications: 32,
      shortlisted: 8,
      daysPosted: 5,
      status: "Active",
    },
    {
      id: 2,
      title: "Product Manager",
      location: "Remote",
      type: "Full-time",
      applications: 45,
      shortlisted: 12,
      daysPosted: 12,
      status: "Active",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "application",
      title: "New application received",
      description: "Sarah Johnson applied for React Developer",
      time: "2 hours ago",
      icon: UserPlus,
      iconColor: "text-primary bg-primary/10",
    },
    {
      id: 2,
      type: "interview",
      title: "Interview scheduled",
      description: "Meeting with John Doe tomorrow at 2 PM",
      time: "4 hours ago",
      icon: Calendar,
      iconColor: "text-green-600 bg-green-100",
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">TF</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">{user.name?.charAt(0) || "U"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Here's your hiring pipeline overview</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat) => (
              <Card key={stat.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Active Job Postings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Active Job Postings</CardTitle>
                    <Button className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Post New Job</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{job.title}</h4>
                        <Badge variant="secondary" className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30">
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{job.type} • {job.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>{job.applications} applications</span>
                          <span>{job.shortlisted} shortlisted</span>
                          <span>Posted {job.daysPosted} days ago</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
