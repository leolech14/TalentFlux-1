import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Mic } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useTranslation } from "@/hooks/useLanguage";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { t } = useTranslation();

  const handleSend = () => {
    if (!input.trim()) return;
    // Handle sending message
    console.log("Sending:", input);
    setInput("");
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    // Handle voice input
  };

  const hotPanels = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'candidates', label: t('candidates') },
    { id: 'cvAssistant', label: t('cvAssistant') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with blur and gradient effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            
            {/* Animated gradient orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Assistant Panel - Centralized */}
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 20
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: 20
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[500px] max-h-[80vh] z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Panel with enhanced glass effect */}
            <motion.div
              className="relative bg-white/5 dark:bg-black/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
              layoutId="magic-star"
              style={{
                boxShadow: "0 0 50px rgba(255, 215, 0, 0.1), 0 0 100px rgba(236, 72, 153, 0.1), 0 0 150px rgba(168, 85, 247, 0.1)",
              }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))",
                  padding: "1px",
                }}
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))",
                    "linear-gradient(225deg, rgba(255, 215, 0, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))",
                    "linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="absolute inset-[1px] bg-black/90 rounded-3xl" />
              </motion.div>

              {/* Content container */}
              <div className="relative">
                {/* Header with gradient accent */}
                <motion.div
                  className="flex items-center justify-between p-6 border-b border-white/10"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="p-2 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #FFD700, #EC4899, #A855F7)",
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{t('aiAssistant')}</h2>
                      <p className="text-sm text-white/70">{t('howCanIHelp')}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>

                {/* Content with subtle gradient background */}
                <motion.div
                  className="p-6 space-y-4 relative overflow-hidden"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {/* Subtle background gradient */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 via-pink-500/10 to-purple-500/10" />
                  </div>

                  {/* Input Area */}
                  <div className="space-y-3 relative z-10">
                    <div className="relative">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('askQuestion')}
                        className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none backdrop-blur-sm hover:bg-white/10 focus:bg-white/10 transition-colors"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                    </div>

                    {/* Action Buttons with gradient effects */}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleMicClick}
                        variant="outline"
                        size="sm"
                        className={`flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all ${
                          isListening ? 'bg-red-500/20 border-red-500/50' : ''
                        }`}
                      >
                        <Mic className={`w-4 h-4 mr-2 ${isListening ? 'text-red-400' : ''}`} />
                        {isListening ? t('listening') : 'Voice'}
                      </Button>
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="flex-1 text-white relative overflow-hidden group"
                        style={{
                          background: "linear-gradient(135deg, #FFD700, #EC4899, #A855F7)",
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <Send className="w-4 h-4 mr-2" />
                          {t('submit')}
                        </span>
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: "linear-gradient(135deg, #A855F7, #EC4899, #FFD700)",
                          }}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* Hot Panels with gradient hover effects */}
                  <div className="space-y-2 relative z-10">
                    <p className="text-sm text-white/70">{t('suggestions')}:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {hotPanels.map((panel, index) => (
                        <motion.button
                          key={panel.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                          onClick={() => {
                            console.log(`Opening ${panel.id}`);
                            onClose();
                          }}
                          className="w-full p-3 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all duration-200 backdrop-blur-sm relative overflow-hidden group"
                        >
                          <span className="relative z-10">{panel.label}</span>
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-20"
                            style={{
                              background: `linear-gradient(90deg, transparent, rgba(${255 - index * 50}, ${215 - index * 30}, ${index * 50}, 0.3), transparent)`,
                            }}
                            animate={{
                              x: [-200, 200],
                            }}
                            transition={{
                              duration: 1,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}