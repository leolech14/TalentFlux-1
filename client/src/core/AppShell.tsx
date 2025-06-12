import { useLocation } from "wouter";
import { MagicStarButton } from "../ui/MagicStarButton";
import { AssistantOverlay } from "../ai/AssistantOverlay";
import CVAssistantOverlay from "../features/cv/CVAssistantOverlay";
import { RepoQueryPanel } from "../features/dev/RepoQueryPanel";
import { DevHUD } from "../ai/DevHUD";
import { Sidebar } from "../ui/Sidebar";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLayout } from "../hooks/useLayout";
import { useUIState } from "../hooks/useUIState";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [cvAssistantOpen, setCvAssistantOpen] = useState(false);
  const [repoAssistantOpen, setRepoAssistantOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  // Handle layout conditionally based on route
  const isRestrictedRoute = location === "/" || location === "/login" || location.startsWith("/onboarding");
  const allowFAB = !isRestrictedRoute;
  const allowThemeToggle = !isRestrictedRoute;
  const { assistantOpen, setAssistantOpen, sidebarOpen, setSidebarOpen } = useUIState();

  // Listen for CV assistant events
  useEffect(() => {
    const handleOpenCVAssistant = () => {
      setCvAssistantOpen(true);
    };
    const handleOpenRepoAssistant = () => {
      setRepoAssistantOpen(true);
    };

    window.addEventListener('open-cv-assistant', handleOpenCVAssistant);
    window.addEventListener('open-repo-assistant', handleOpenRepoAssistant);
    return () => {
      window.removeEventListener('open-cv-assistant', handleOpenCVAssistant);
      window.removeEventListener('open-repo-assistant', handleOpenRepoAssistant);
    };
  }, []);

  // Show MagicStar only when layout context allows and user is authenticated
  const showMagicStar = allowFAB && isAuthenticated && location !== "/" && location !== "/login" && !location.startsWith("/onboarding");

  // Show theme toggle when layout context allows
  const showThemeToggle = allowThemeToggle;

  // Listen for sidebar open events from intent router
  useEffect(() => {
    const handleOpenSidebar = () => setSidebarOpen(true);
    window.addEventListener('openSidebar', handleOpenSidebar);
    return () => window.removeEventListener('openSidebar', handleOpenSidebar);
  }, [setSidebarOpen]);

  return (
    <div className="min-h-screen relative bg-background text-foreground transition-colors duration-300">
      {children}

      {showMagicStar && !assistantOpen && (
        <MagicStarButton 
          onClick={() => { if (!cvAssistantOpen) setAssistantOpen(true); }}
          isOpen={assistantOpen}
        />
      )}

      <AssistantOverlay 
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      {/* CV Assistant Overlay - specialized for CV creation */}
      <CVAssistantOverlay
        open={cvAssistantOpen}
        onClose={() => setCvAssistantOpen(false)}
      />

      {/* Repository AI Assistant - for development queries */}
      <RepoQueryPanel
        isOpen={repoAssistantOpen}
        onClose={() => setRepoAssistantOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Theme Toggle */}
      {showThemeToggle && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      {/* Development HUD - shows AI events in real-time */}
      <DevHUD />
    </div>
  );
}