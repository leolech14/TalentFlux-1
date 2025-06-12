import { useLocation } from "wouter";
import { MagicStarButton } from "../ui/MagicStarButton";
import { AssistantOverlay } from "../ai/AssistantOverlay";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useLayout } from "../lib/LayoutContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { allowFAB, allowAssistant, allowThemeToggle } = useLayout();

  // Show MagicStar only when layout context allows and user is authenticated
  const showMagicStar = allowFAB && isAuthenticated && location !== "/" && location !== "/login" && !location.startsWith("/onboarding");
  
  // Show theme toggle when layout context allows
  const showThemeToggle = allowThemeToggle;

  return (
    <div className="min-h-screen relative bg-background text-foreground transition-colors duration-300">
      {children}
      
      {showMagicStar && !isAssistantOpen && (
        <MagicStarButton 
          onClick={() => setIsAssistantOpen(true)}
          isOpen={isAssistantOpen}
        />
      )}

      {allowAssistant && (
        <AssistantOverlay 
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
        />
      )}
      
      {/* Theme Toggle */}
      {showThemeToggle && (
        <motion.button
          onClick={toggleTheme}
          className={`fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isDark 
              ? "bg-zinc-800 hover:bg-zinc-700 text-yellow-400 hover:text-yellow-300" 
              : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-700 border border-slate-200"
          }`}
          style={{
            marginBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            marginLeft: "max(1.5rem, env(safe-area-inset-left))"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.div>
        </motion.button>
      )}
    </div>
  );
}
