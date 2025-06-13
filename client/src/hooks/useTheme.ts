import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'alt';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

let isApplyingTheme = false;

const applyTheme = (theme: Theme) => {
  if (isApplyingTheme) return;
  isApplyingTheme = true;

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

  // Reset flag after a microtask to ensure DOM updates are complete
  Promise.resolve().then(() => {
    isApplyingTheme = false;
  });
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark' as Theme, // Default to dark mode
      setTheme: (theme: Theme) => {
        const currentTheme = get().theme;
        if (currentTheme === theme) return; // Prevent unnecessary updates
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration with a small delay to prevent race conditions
        if (state?.theme) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            applyTheme(state.theme);
          });
        }
      },
    }
  )
);