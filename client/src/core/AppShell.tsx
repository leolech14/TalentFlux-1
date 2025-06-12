import { useLocation } from "wouter";
import { MagicStarButton } from "../ui/MagicStarButton";
import { AssistantOverlay } from "../ai/AssistantOverlay";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  // Don't show MagicStar on landing or login pages
  const showMagicStar = isAuthenticated && location !== "/" && location !== "/login";

  return (
    <div className="min-h-screen relative">
      {children}
      
      {showMagicStar && (
        <>
          <MagicStarButton 
            onClick={() => setIsAssistantOpen(true)}
            isOpen={isAssistantOpen}
          />
          <AssistantOverlay 
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
          />
        </>
      )}
    </div>
  );
}
