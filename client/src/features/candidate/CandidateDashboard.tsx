import { motion } from "framer-motion";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { DashboardGrid } from "../dashboard/DashboardGrid";
import { useUIState } from "../../hooks/useUIState";

interface CandidateDashboardProps {
  user: User;
}

export function CandidateDashboard({ user }: CandidateDashboardProps) {
  const { setSidebarOpen } = useUIState();

  return (
    <>
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
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
      <main className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 pb-4"
          >
            <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Here's what's happening with your job search</p>
          </motion.div>

          {/* Widget Grid */}
          <DashboardGrid />
        </div>
      </main>
    </>
  );
}
