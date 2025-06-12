import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Send, Home, Users, BarChart3, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { IntentRouter } from "./IntentRouter";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const intentRouter = new IntentRouter();

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsProcessing(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const intent = intentRouter.planFromUtterance(message, user?.userType || "candidate");
      intentRouter.executeIntent(intent, setLocation);
      setMessage("");
      setIsProcessing(false);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      handleSendMessage();
    }
  };

  const handleQuickAction = (intent: string) => {
    intentRouter.executeIntent(intent, setLocation);
    onClose();
  };

  const handleVoiceInput = () => {
    // Voice input would be implemented here with Web Speech API
    console.log("Voice input activated");
  };

  // Dynamic styling based on theme
  const backdropClass = "fixed inset-0 backdrop-blur-md transition-colors duration-300";
  const backdropBg = isDark ? "bg-black/50" : "bg-black/30";
  
  const panelClass = `rounded-2xl shadow-2xl w-full max-w-md p-6 transition-colors duration-300 ${
    isDark ? "bg-zinc-900/95 border border-zinc-700/50" : "bg-white/95 border border-white/20"
  }`;
  
  const headerTextClass = isDark ? "text-zinc-100" : "text-slate-900";
  const inputClass = `flex-1 outline-none text-sm transition-colors duration-300 ${
    isDark 
      ? "bg-transparent text-zinc-100 placeholder-zinc-400" 
      : "bg-transparent text-slate-900 placeholder-slate-500"
  }`;
  
  const inputContainerClass = `flex items-center space-x-2 p-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300 ${
    isDark 
      ? "bg-zinc-800 border border-zinc-700" 
      : "bg-white border border-slate-200"
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className={`${backdropClass} ${backdropBg}`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Assistant Panel */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              className={panelClass}
              layoutId="magic-star"
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.3, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-primary"}`} />
                  </motion.div>
                  <h3 className={`text-lg font-semibold ${headerTextClass}`}>AI Assistant</h3>
                </div>
                <button 
                  onClick={onClose}
                  className={`transition-colors duration-200 ${
                    isDark ? "text-zinc-400 hover:text-zinc-200" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Chat Input */}
              <div className="mb-6">
                <div className={inputContainerClass}>
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={inputClass}
                    autoFocus
                    disabled={isProcessing}
                  />
                  <button 
                    onClick={handleVoiceInput}
                    className={`transition-colors duration-200 ${
                      isDark ? "text-zinc-400 hover:text-zinc-200" : "text-slate-400 hover:text-slate-600"
                    }`}
                    disabled={isProcessing}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className={`transition-colors duration-200 ${
                      isDark ? "text-purple-400 hover:text-purple-300" : "text-primary hover:text-primary/80"
                    }`}
                    disabled={isProcessing || !message.trim()}
                  >
                    {isProcessing ? (
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
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <p className={`text-sm font-medium mb-3 ${
                  isDark ? "text-zinc-300" : "text-slate-700"
                }`}>Quick Actions</p>
                
                <motion.button
                  onClick={() => handleQuickAction("open-dashboard")}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    isDark 
                      ? "hover:bg-zinc-800 text-zinc-200" 
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-primary"}`} />
                  <span className="text-sm">Go to Dashboard</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleQuickAction("open-candidates")}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    isDark 
                      ? "hover:bg-zinc-800 text-zinc-200" 
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users className="text-cyan-500 w-5 h-5" />
                  <span className="text-sm">
                    {user?.userType === "employer" ? "My Candidates" : "Browse Jobs"}
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleQuickAction("business-panel")}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    isDark 
                      ? "hover:bg-zinc-800 text-zinc-200" 
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BarChart3 className="text-purple-500 w-5 h-5" />
                  <span className="text-sm">Analytics Panel</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
