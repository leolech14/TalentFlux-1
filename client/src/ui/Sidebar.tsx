import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Users, FileText, BarChart3, Settings, HelpCircle, Briefcase, Calendar, FileSignature, TrendingUp, Award, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useUserType } from "../hooks/useUserType";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const userType = useUserType();

  const employerNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Briefcase, label: "Job Postings", path: "/jobs" },
    { icon: Users, label: "Candidates", path: "/candidates" },
    { icon: Calendar, label: "Interviews", path: "/interviews" },
    { icon: FileSignature, label: "Contracts", path: "/contracts" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: TrendingUp, label: "Reports", path: "/reports" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  const candidateNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "My CV", path: "/cv" },
    { icon: Briefcase, label: "Applications", path: "/applications" },
    { icon: Calendar, label: "Interviews", path: "/interviews" },
    { icon: Award, label: "Certifications", path: "/certifications" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  const navItems = userType === "employer" ? employerNavItems : candidateNavItems;

  const handleNavigation = (path: string) => {
    setLocation(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 z-50"
          >
            {/* Glass panel */}
            <div className="h-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border-r border-white/20 shadow-2xl">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />

              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">TalentFlux</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name || "User"}</p>
                    <p className="text-white/60 text-sm capitalize">{userType}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;

                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-white/20 text-white shadow-lg"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>© 2024 TalentFlux</span>
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}