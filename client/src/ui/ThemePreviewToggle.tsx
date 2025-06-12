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
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
        altTheme 
          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" 
          : "bg-muted hover:bg-tf-accent/20 text-muted-foreground hover:text-tf-accent"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: altTheme ? 360 : 0,
        backgroundColor: altTheme ? "#a855f7" : undefined
      }}
      transition={{ duration: 0.5 }}
      aria-label={`${altTheme ? 'Disable' : 'Enable'} alternative theme preview`}
      data-singleton="theme-preview-toggle"
      data-testid="theme-preview-toggle"
    >
      <motion.span 
        className="text-sm font-bold"
        animate={{
          color: altTheme ? "#ffffff" : undefined,
          scale: altTheme ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        ★
      </motion.span>
    </motion.button>
  );
}