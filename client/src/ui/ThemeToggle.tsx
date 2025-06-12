import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'alt' : 'light';
    setTheme(next);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'alt': return Sparkles;
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
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'alt' : 'light'} theme`}
    >
      <Icon className="w-4 h-4" />
    </motion.button>
  );
}