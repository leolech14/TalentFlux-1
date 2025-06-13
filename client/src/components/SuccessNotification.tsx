import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslatedText } from "./TranslatedText";

interface SuccessNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onDownload?: () => void;
  onEmail?: () => void;
}

export function SuccessNotification({ 
  isVisible, 
  onClose, 
  title, 
  message, 
  onDownload, 
  onEmail 
}: SuccessNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4"
        >
          <div className="relative bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/20">
            {/* Glass frame effect with gradient */}
            <div className="absolute inset-0 rounded-2xl border border-white/30 dark:border-gray-400/30 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-2xl border border-white/10 dark:border-gray-500/10 pointer-events-none" />
            
            {/* Inner glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-gray-100/20 dark:via-gray-100/5 dark:to-transparent pointer-events-none" />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {(onDownload || onEmail) && (
                <div className="flex gap-3">
                  {onDownload && (
                    <Button
                      onClick={onDownload}
                      className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm text-white border border-white/20"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  {onEmail && (
                    <Button
                      onClick={onEmail}
                      variant="outline"
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
                      size="sm"
                    >
                      Send via Email
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}