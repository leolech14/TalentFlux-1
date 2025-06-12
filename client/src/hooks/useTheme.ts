import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'alt';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const applyTheme = (theme: Theme) => {
  // Remove all theme classes
  document.documentElement.classList.remove('dark', 'alt');
  document.documentElement.removeAttribute('data-theme');

  // Apply the new theme
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'alt') {
    document.documentElement.classList.add('alt');
    document.documentElement.setAttribute('data-theme', 'alt');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark' as Theme, // Default to dark mode
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);