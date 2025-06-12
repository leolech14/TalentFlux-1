import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIntentRouter } from "./IntentRouter";
import { useUserType } from "../hooks/useUserType";
import { useUIState } from "../hooks/useUIState";
import { planFromUtterance, getSuggestedCommands } from "./planFromUtterance";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const userType = useUserType();
  const { toast } = useToast();
  const { intentRouter, executeIntent } = useIntentRouter();
  const { setAssistantOpen } = useUIState();

  useEffect(() => {
    setAssistantOpen(isOpen);
    if (isOpen) {
      registerSingleton("assistant-overlay");
      return () => unregisterSingleton("assistant-overlay");
    }
  }, [isOpen, setAssistantOpen]);

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setThinking(true);
    
    // Simulate brief processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const intent = planFromUtterance(text, intentRouter, userType);
    setThinking(false);

    if (intent) {
      toast({
        title: "✓ " + intent.description,
        duration: 2000,
      });
      executeIntent(intent);
      onClose();
      
      // Optional follow-up suggestion
      setTimeout(() => {
        toast({
          title: "Need more details?",
          description: "Say \"yes\" or tap the star for help.",
          duration: 3000,
        });
      }, 1200);
    } else {
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

  const suggestions = getSuggestedCommands(userType);

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
