import { motion } from "framer-motion";
import { Bell, Layers, Calendar, Eye, TrendingUp, CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User } from "@shared/schema";

interface CandidateDashboardProps {
  user: User;
}

export function CandidateDashboard({ user }: CandidateDashboardProps) {
  const stats = [
    { label: "Applications", value: "12", change: "+2 this week", icon: Layers, color: "text-primary" },
    { label: "Interviews", value: "3", change: "1 scheduled", icon: Calendar, color: "text-cyan-500" },
    { label: "Profile Views", value: "47", change: "+8 this week", icon: Eye, color: "text-purple-500" },
    { label: "Response Rate", value: "68%", change: "+5% from last month", icon: TrendingUp, color: "text-green-500" },
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      match: "90%",
      skills: ["React", "TypeScript", "Node.js"],
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $130k",
      type: "Full-time",
      match: "85%",
      skills: ["Vue.js", "Python", "AWS"],
    },
  ];

  const profileTasks = [
    { id: 1, task: "Basic Information", completed: true },
    { id: 2, task: "Work Experience", completed: true },
    { id: 3, task: "Skills Assessment", completed: false },
    { id: 4, task: "Portfolio Upload", completed: false },
  ];

  const completedTasks = profileTasks.filter(task => task.completed).length;
  const completionPercentage = (completedTasks / profileTasks.length) * 100;

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
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-slate-600">Here's what's happening with your job search</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 text-sm font-medium">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-green-600">{stat.change}</div>
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
            {/* Recommended Jobs */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recommended Jobs</CardTitle>
                    <Button variant="outline" size="sm">View all</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{job.title}</h4>
                        <Badge variant="secondary" className="text-green-600 bg-green-100">
                          {job.match} match
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-2">{job.company} • {job.location}</p>
                      <p className="text-sm text-slate-500 mb-3">{job.salary} • {job.type}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="text-primary hover:text-primary/80" variant="ghost">
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Profile Completion */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    {profileTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                        <span className="text-sm text-slate-600">{task.task}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
