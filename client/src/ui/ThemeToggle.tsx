import { motion } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { isDark, toggle: cycleTheme } = useTheme();

  const getIcon = () => {
    if (isDark === undefined) {
      return Moon; // Or some other default
    }
    
    switch (true) {
      case !isDark: return Sun;
      case isDark: return Moon;
      default: return Moon;
    }
  };

  const Icon = getIcon();

  return (
    <motion.button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-border/50 text-foreground hover:bg-surface/80 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${!isDark ? 'dark' : 'light'} theme`}
    >
      <Icon className="w-4 h-4" />
    </motion.button>
  );
}