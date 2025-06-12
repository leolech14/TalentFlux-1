import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { registerSingleton, unregisterSingleton } from '../lib/SingletonRegistry';

export function ThemePreviewToggle() {
  const [altTheme, setAltTheme] = useState(false);

  useEffect(() => {
    registerSingleton("theme-preview-toggle");
    return () => unregisterSingleton("theme-preview-toggle");
  }, []);

  useEffect(() => {
    if (altTheme) {
      document.documentElement.classList.add('alt-theme');
    } else {
      document.documentElement.classList.remove('alt-theme');
    }
  }, [altTheme]);

  return (
    <motion.button
      onClick={() => setAltTheme(!altTheme)}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        altTheme 
          ? "bg-tf-accent text-tf-dark shadow-tf-halo" 
          : "bg-muted hover:bg-tf-accent/20 text-muted-foreground hover:text-tf-accent"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle alternative theme preview"
      data-singleton="theme-preview-toggle"
      data-testid="theme-preview-toggle"
    >
      <span className="text-sm font-bold">★</span>
    </motion.button>
  );
}