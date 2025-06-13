import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { GeneralAssistant } from "./GeneralAssistant";
import { CodeAssistant } from "./CodeAssistant";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Assistant Panel with enhanced animation */}
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
              rotate: -180,
              x: "-50%",
              y: "-50%"
            }}
            animate={{
              scale: [0, 1.1, 0.95, 1],
              opacity: [0, 0.5, 0.8, 1],
              rotate: [-180, -90, -45, 0],
              x: "-50%",
              y: "-50%"
            }}
            exit={{
              scale: [1, 0.95, 1.1, 0],
              opacity: [1, 0.8, 0.5, 0],
              rotate: [0, 45, 90, 180],
              x: "-50%",
              y: "-50%"
            }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
              times: [0, 0.4, 0.7, 1]
            }}
            className="fixed left-1/2 top-1/2 w-[90vw] md:w-[800px] h-[80vh] md:h-[600px] z-50"
            style={{ transformOrigin: "center center" }}
          >
            {/* Enhanced purple glow effect */}
            <motion.div
              className="absolute -inset-8 rounded-3xl opacity-40"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.5) 0%, transparent 60%)",
                  "radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.5) 0%, transparent 60%)",
                  "radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.5) 0%, transparent 60%)",
                  "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.5) 0%, transparent 60%)",
                  "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.5) 0%, transparent 60%)",
                  "radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.5) 0%, transparent 60%)",
                ],
                scale: [1, 1.1, 1.05, 1.1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Animated border effect */}
            <motion.div
              className="absolute -inset-[2px] rounded-3xl"
              style={{
                background: "linear-gradient(135deg, #9333ea, #ec4899, #f59e0b, #10b981, #3b82f6, #9333ea)",
                backgroundSize: "300% 300%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Glass panel with enhanced effects */}
            <motion.div
              className="relative h-full bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(24px)" }}
              transition={{ duration: 0.6 }}
            >
              {/* Inner glow with animation */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse at top right, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Enhanced floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${4 + i * 2}px`,
                    height: `${4 + i * 2}px`,
                    background: `radial-gradient(circle, ${
                      i % 2 === 0 ? 'rgba(147, 51, 234, 0.8)' : 'rgba(236, 72, 153, 0.8)'
                    } 0%, transparent 70%)`,
                    left: `${10 + i * 10}%`,
                    top: `${5 + i * 8}%`,
                  }}
                  animate={{
                    y: [0, -30, -10, -40, 0],
                    x: [0, 15, -10, 20, 0],
                    opacity: [0, 0.8, 1, 0.6, 0],
                    scale: [0.5, 1.2, 1, 1.3, 0.5],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Header with enhanced animation */}
              <motion.div
                className="flex items-center justify-between p-6 border-b border-white/10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
                    <p className="text-sm text-white/70">How can I help you today?</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Content with fade-in animation */}
              <motion.div
                className="p-6 h-[calc(100%-80px)] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Tabs defaultValue="general" className="h-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
                    <TabsTrigger value="general" className="data-[state=active]:bg-white/20">
                      General
                    </TabsTrigger>
                    <TabsTrigger value="code" className="data-[state=active]:bg-white/20">
                      Code Repository
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="h-[calc(100%-48px)] mt-4">
                    <GeneralAssistant />
                  </TabsContent>
                  <TabsContent value="code" className="h-[calc(100%-48px)] mt-4">
                    <CodeAssistant />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}