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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Assistant Panel */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.5
            }}
            className="fixed inset-x-4 inset-y-16 md:inset-x-auto md:inset-y-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-auto md:w-[800px] md:h-[600px] z-50"
          >
            {/* Purple glow effect */}
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 80%, rgba(196, 181, 253, 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Wobbling border effect */}
            <motion.div
              className="absolute -inset-[2px] rounded-3xl"
              style={{
                background: "linear-gradient(45deg, rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.5))",
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Glass panel */}
            <div className="relative h-full bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, -10, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
              </div>

              {/* Content */}
              <div className="p-6 h-[calc(100%-80px)] overflow-hidden">
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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}