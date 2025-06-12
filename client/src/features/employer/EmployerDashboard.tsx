import { motion } from "framer-motion";
import { Bell, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { DashboardGrid } from "../dashboard/DashboardGrid";
import { ThemePreviewToggle } from "../../ui/ThemePreviewToggle";
import { useTheme } from "../../hooks/useTheme";
import { useUIState } from "../../hooks/useUIState";

interface EmployerDashboardProps {
  user: User;
}

export function EmployerDashboard({ user }: EmployerDashboardProps) {
  const { isDark, toggleTheme } = useTheme();
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
              className="text-muted-foreground hover:text-tf-accent"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-tf-accent-gradient rounded-lg flex items-center justify-center shadow-tf-halo">
              <span className="text-tf-dark font-semibold text-sm">TF</span>
            </div>
            <h1 className="text-xl font-semibold text-tf-text dark:text-tf-text-dark">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-tf-accent">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <span className="text-sm font-medium">{user.name}</span>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-tf-accent/20 text-muted-foreground hover:text-tf-accent transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>
                <ThemePreviewToggle />
              </div>
            </div>
            <div className="w-8 h-8 bg-tf-accent/10 border border-tf-stroke rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-tf-text dark:text-tf-text-dark">{user.name?.charAt(0) || "U"}</span>
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
            className="p-4 sm:p-6 pb-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Welcome back, {user.name}!</h2>
            <p className="text-neutral-600 dark:text-neutral-300">Here's your hiring pipeline overview</p>
          </motion.div>

          {/* Widget Grid */}
          <DashboardGrid />
        </div>
      </main>
    </>
  );
}