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
  
  // Apply theme classes
  document.documentElement.classList.remove('dark', 'alt', 'minimal');
  document.documentElement.removeAttribute('data-theme');
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'alt') {
    document.documentElement.classList.add('alt');
    document.documentElement.setAttribute('data-theme', 'alt');
  } else if (theme === 'minimal') {
    document.documentElement.classList.add('minimal');
    document.documentElement.setAttribute('data-theme', 'minimal');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

// Initialize theme before React renders
initializeTheme();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <FluxProvider>
    <App />
  </FluxProvider>
);
