import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIntentRouter } from "./IntentRouter";
import { useUserType } from "../hooks/useUserType";
import { useUIState } from "../hooks/useUIState";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { planFromUtterance, getSuggestedCommands } from "./planFromUtterance";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";
import { emitAIEvent } from "./emitAIEvent";
import { recordFeedback } from "./recordFeedback";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lastEventId, setLastEventId] = useState<number | null>(null);
  const userType = useUserType();
  const { toast } = useToast();
  const { intentRouter, executeIntent } = useIntentRouter();
  const { setAssistantOpen } = useUIState();
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    setAssistantOpen(isOpen);
    if (isOpen) {
      registerSingleton("assistant-overlay");
      return () => unregisterSingleton("assistant-overlay");
    }
  }, [isOpen, setAssistantOpen]);

  const showFeedbackToast = (eventId: number) => {
    if (eventId === -1) return; // Skip if event creation failed
    
    setTimeout(() => {
      toast({
        title: "Was this helpful?",
        description: (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => recordFeedback(eventId, true)}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
            >
              <ThumbsUp size={14} />
              Yes
            </button>
            <button
              onClick={() => recordFeedback(eventId, false)}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
            >
              <ThumbsDown size={14} />
              No
            </button>
          </div>
        ),
        duration: 5000,
      });
    }, 1500);
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setThinking(true);
    
    // Check if this is a repo-related query (development/code questions)
    const isRepoQuery = text.toLowerCase().includes('code') || 
                       text.toLowerCase().includes('implement') || 
                       text.toLowerCase().includes('bug') ||
                       text.toLowerCase().includes('where') ||
                       text.toLowerCase().includes('how does') ||
                       text.toLowerCase().includes('refactor') ||
                       text.toLowerCase().includes('fix');

    // Handle repo-aware queries for authenticated users
    if (isAuthenticated && isRepoQuery) {
      try {
        const response = await fetch('/api/repo/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text })
        });

        if (response.ok) {
          const data = await response.json();
          setThinking(false);
          setInput("");
          
          // Emit AI event for repo query
          const eventId = await emitAIEvent('repo-query', {
            userId: isAuthenticated ? 'authenticated' : 'anonymous',
            route: location,
            device: window.innerWidth < 768 ? 'mobile' : 'desktop'
          });
          setLastEventId(eventId);
          
          toast({
            title: "Repository Assistant",
            description: data.response.slice(0, 200) + (data.response.length > 200 ? "..." : ""),
            duration: 8000,
          });
          
          // Show feedback toast
          showFeedbackToast(eventId);
          
          // Close overlay after showing response
          setTimeout(() => onClose(), 1000);
          return;
        }
      } catch (error) {
        console.warn('Repo query failed, falling back to intent routing');
      }
    }
    
    // Simulate brief processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Special handling for non-authenticated users on signup pages
    if (!isAuthenticated && (location.includes('/onboarding') || location === '/login' || location === '/')) {
      setThinking(false);
      setInput("");
      
      if (text.toLowerCase().includes('cv') || text.toLowerCase().includes('resume')) {
        toast({
          title: "CV Creation Preview",
          description: "Complete signup to unlock AI-powered CV creation with natural language processing",
          duration: 4000,
        });
        return;
      }
      
      toast({
        title: "Sign up to continue",
        description: "Complete registration to access the full AI assistant experience",
        duration: 3000,
      });
      return;
    }
    
    const intent = planFromUtterance(text, intentRouter, userType);
    setThinking(false);

    if (intent) {
      // Emit AI event before executing intent
      const eventId = await emitAIEvent(intent.id, {
        userId: isAuthenticated ? 'authenticated' : 'anonymous',
        route: location,
        device: window.innerWidth < 768 ? 'mobile' : 'desktop'
      });
      setLastEventId(eventId);
      
      toast({
        title: "✓ " + intent.description,
        duration: 2000,
      });
      executeIntent(intent);
      onClose();
      
      // Show feedback toast after action
      showFeedbackToast(eventId);
      
      // Optional follow-up suggestion
      setTimeout(() => {
        toast({
          title: "Need more details?",
          description: "Say \"yes\" or tap the star for help.",
          duration: 3000,
        });
      }, 1200);
    } else {
      // Emit AI event for failed intent recognition
      const eventId = await emitAIEvent('intent-not-found', {
        userId: isAuthenticated ? 'authenticated' : 'anonymous',
        route: location,
        device: window.innerWidth < 768 ? 'mobile' : 'desktop'
      });
      
      toast({
        title: "Sorry, I didn't understand that",
        description: "Try rephrasing or use one of the suggestions below.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !thinking) {
      handleSubmit(input);
      setInput("");
    }
  };

  const handleSendClick = () => {
    handleSubmit(input);
    setInput("");
  };

  const handleVoiceInput = () => {
    // Voice input implementation would go here
    toast({
      title: "Voice input",
      description: "Voice recognition would be implemented here",
      duration: 2000,
    });
  };

  // Show different suggestions for non-authenticated users on signup pages
  const isSignupFlow = !isAuthenticated && (location.includes('/onboarding') || location === '/login' || location === '/');
  const suggestions = isSignupFlow 
    ? ["Create my CV", "How does AI CV work?", "What can you help me with?", "Tell me about TalentFlux"]
    : getSuggestedCommands(userType);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-singleton="assistant-overlay"
          data-testid="assistant-overlay"
        >
          {/* Backdrop - tap to dismiss */}
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Assistant Panel - Mobile-first design */}
          <div className="fixed top-0 left-0 w-full h-full sm:relative sm:h-auto flex items-center justify-center p-0 sm:p-6">
            <motion.div
              className="relative w-full h-full sm:h-auto sm:max-w-lg sm:rounded-xl bg-card border-0 sm:border border-border p-6 flex flex-col"
              layoutId="magic-star"
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.3, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* Header - no close button */}
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-tf-accent" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
              </div>
              
              {/* Chat Input */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 p-3 rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-tf-accent/50">
                  <input
                    type="text"
                    placeholder="Tell me what you want to do..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 outline-none text-sm bg-transparent text-foreground placeholder-muted-foreground"
                    autoFocus
                    disabled={thinking}
                  />
                  <button 
                    onClick={handleVoiceInput}
                    className="text-muted-foreground hover:text-tf-accent transition-colors"
                    disabled={thinking}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSendClick}
                    className="text-tf-accent hover:text-tf-accent/80 transition-colors"
                    disabled={thinking || !input.trim()}
                  >
                    {thinking ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-sm font-medium mb-3 text-muted-foreground">
                  Try saying:
                </p>
                
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setInput(suggestion);
                      handleSubmit(suggestion);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm text-muted-foreground">"</span>
                    <span className="text-sm text-foreground">{suggestion}</span>
                    <span className="text-sm text-muted-foreground">"</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
