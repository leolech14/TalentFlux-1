import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CVAIAssistantPanelProps {
  onClose?: () => void;
}

export function CVAIAssistantPanel({ onClose }: CVAIAssistantPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full"
    >
      <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              CV AI Assistant
            </h3>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Create your professional CV with AI assistance. Answer a few questions and let our AI generate a polished CV for you.
          </p>
          
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Start CV Creation
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 