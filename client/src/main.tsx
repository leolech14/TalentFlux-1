import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { FluxProvider } from "./core/FluxProvider";
import { useTheme } from "./hooks/useTheme";

// Initialize theme on app start
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-storage');
  let isDark = true; // Default to dark mode
  
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      isDark = parsed.state?.isDark ?? true;
    } catch (e) {
      console.warn('Failed to parse theme from localStorage');
    }
  }
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")!).render(
  <FluxProvider>
    <App />
  </FluxProvider>
);
