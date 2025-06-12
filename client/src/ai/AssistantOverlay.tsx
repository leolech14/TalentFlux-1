import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Send, Home, Users, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { IntentRouter } from "./IntentRouter";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  const [message, setMessage] = useState("");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const intentRouter = new IntentRouter();

  const handleSendMessage = () => {
    if (message.trim()) {
      const intent = intentRouter.planFromUtterance(message, user?.userType || "candidate");
      intentRouter.executeIntent(intent, setLocation);
      setMessage("");
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleQuickAction = (intent: string) => {
    intentRouter.executeIntent(intent, setLocation);
    onClose();
  };

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
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Assistant Panel */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              layoutId="magic-star"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Chat Input */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 outline-none text-sm"
                    autoFocus
                  />
                  <button 
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => {
                      // Voice input would be implemented here
                      console.log("Voice input activated");
                    }}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 mb-3">Quick Actions</p>
                <button
                  onClick={() => handleQuickAction("open-dashboard")}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-3"
                >
                  <Home className="text-primary w-5 h-5" />
                  <span className="text-sm">Go to Dashboard</span>
                </button>
                <button
                  onClick={() => handleQuickAction("open-candidates")}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-3"
                >
                  <Users className="text-cyan-500 w-5 h-5" />
                  <span className="text-sm">
                    {user?.userType === "employer" ? "My Candidates" : "Browse Jobs"}
                  </span>
                </button>
                <button
                  onClick={() => handleQuickAction("business-panel")}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-3"
                >
                  <BarChart3 className="text-purple-500 w-5 h-5" />
                  <span className="text-sm">Analytics Panel</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
