import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import CVAssistantPanel from "./CVAssistantPanel";

interface CVAssistantOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function CVAssistantOverlay({ open, onClose }: CVAssistantOverlayProps) {
  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-4 md:inset-8 lg:inset-16"
          onClick={(e) => e.stopPropagation()}
        >
          <CVAssistantPanel onClose={onClose} />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}