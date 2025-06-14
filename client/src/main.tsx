import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { FluxProvider } from "./core/FluxProvider";
import { useTheme } from "./hooks/useTheme";
import "./lib/VisualGuard";

// Initialize theme on app start
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-storage');
  let theme = 'dark'; // Default to dark mode
  
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      // Handle migration from old isDark boolean to new theme string
      if (parsed.state?.theme) {
        theme = parsed.state.theme;
      } else if (parsed.state?.isDark !== undefined) {
        theme = parsed.state.isDark ? 'dark' : 'light';
      }
    } catch (e) {
      console.warn('Failed to parse theme from localStorage');
    }
  }
  
  // Force dark mode as default if no saved preference
  if (!savedTheme) {
    theme = 'dark';
  }
  
  // Apply theme classes immediately
  document.documentElement.classList.remove('dark', 'alt', 'minimal', 'matrix');
  document.documentElement.removeAttribute('data-theme');
  
  // Force dark mode styling
  if (theme === 'dark' || !theme) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.backgroundColor = 'rgb(3, 7, 18)';
  } else if (theme === 'alt') {
    document.documentElement.classList.add('alt');
    document.documentElement.setAttribute('data-theme', 'alt');
    document.documentElement.style.backgroundColor = 'rgb(2, 6, 9)';
  } else if (theme === 'minimal') {
    document.documentElement.classList.add('minimal');
    document.documentElement.setAttribute('data-theme', 'minimal');
    document.documentElement.style.backgroundColor = 'rgb(0, 0, 0)';
  } else if (theme === 'matrix') {
    document.documentElement.classList.add('matrix');
    document.documentElement.setAttribute('data-theme', 'matrix');
    document.documentElement.style.backgroundColor = 'rgb(0, 0, 0)';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.backgroundColor = 'rgb(255, 255, 255)';
  }
};

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")!).render(
  <FluxProvider>
    <App />
  </FluxProvider>
);
