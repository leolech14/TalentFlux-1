import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'alt' | 'minimal' | 'matrix';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const applyTheme = (theme: Theme) => {
  // Ensure we're in a browser environment
  if (typeof document === 'undefined') return;

  // Remove all theme classes immediately
  document.documentElement.classList.remove('dark', 'alt', 'minimal', 'matrix');
  document.documentElement.removeAttribute('data-theme');

  // Apply the new theme immediately
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'alt') {
    document.documentElement.classList.add('alt');
    document.documentElement.setAttribute('data-theme', 'alt');
  } else if (theme === 'minimal') {
    document.documentElement.classList.add('minimal');
    document.documentElement.setAttribute('data-theme', 'minimal');
  } else if (theme === 'matrix') {
    document.documentElement.classList.add('matrix');
    document.documentElement.setAttribute('data-theme', 'matrix');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: (localStorage.getItem('theme-preference') as Theme) || 'dark',
      setTheme: (theme: Theme) => {
        const currentTheme = get().theme;
        if (currentTheme === theme) return; // Prevent unnecessary updates
        localStorage.setItem('theme-preference', theme);
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      // Don't reapply theme on rehydration since it's already applied in main.tsx
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const savedTheme = (localStorage.getItem('theme-preference') as Theme) || 'dark';
  applyTheme(savedTheme);
}