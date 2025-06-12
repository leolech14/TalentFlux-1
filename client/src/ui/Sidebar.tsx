import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, BarChart3, Settings, FileText, Briefcase, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useUserType } from "../hooks/useUserType";
import { useUIState } from "../hooks/useUIState";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";
import { CVAssistantPanel } from "../features/cv/CVAssistantPanel";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  icon: any;
  label: string;
  path?: string;
  action?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const userType = useUserType();
  const { setSidebarOpen } = useUIState();
  const [showCVAssistant, setShowCVAssistant] = useState(false);

  useEffect(() => {
    setSidebarOpen(isOpen);
    if (isOpen) {
      registerSingleton("sidebar");
      return () => unregisterSingleton("sidebar");
    }
  }, [isOpen, setSidebarOpen]);

  const variants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  const employerNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Candidates", path: "/dashboard?panel=candidate-list" },
    { icon: Briefcase, label: "Post Job", path: "/dashboard?panel=job-form" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard?panel=analytics" },
    { icon: Settings, label: "Company", path: "/dashboard?panel=company-settings" },
  ];

  const candidateNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Briefcase, label: "Find Jobs", path: "/dashboard?panel=job-list" },
    { icon: FileText, label: "My Applications", path: "/dashboard?panel=applications" },
    { icon: Bot, label: "AI CV Assistant", action: () => setShowCVAssistant(true) },
    { icon: FileText, label: "Upload CV", path: "/dashboard?panel=cv-upload" },
    { icon: Settings, label: "Profile", path: "/dashboard?panel=profile-settings" },
  ];

  const navItems = userType === 'employer' ? employerNavItems : candidateNavItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - tap to dismiss */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="sidebar-backdrop"
          />
          
          {/* Sidebar Panel */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-card border-l border-border z-50 shadow-tf-elevation"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            data-singleton="sidebar"
            data-testid="sidebar"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-tf-accent-gradient rounded-lg flex items-center justify-center shadow-tf-halo">
                  <span className="text-tf-dark font-semibold text-sm">TF</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">TalentFlux</h2>
                  <p className="text-sm text-muted-foreground capitalize">{userType} Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                if ('action' in item && item.action) {
                  // Handle action buttons (like CV Assistant)
                  return (
                    <motion.div
                      key={`action-${index}`}
                      className="flex items-center space-x-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        item.action!();
                        onClose();
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  );
                }
                // Handle navigation links
                return (
                  <Link key={item.path || `nav-${index}`} href={item.path!}>
                    <motion.div
                      className="flex items-center space-x-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-6 left-4 right-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  AI-native HR made human
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}