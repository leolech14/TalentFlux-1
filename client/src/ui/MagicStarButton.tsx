import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface MagicStarButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function MagicStarButton({ onClick, isOpen }: MagicStarButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load saved position from localStorage
    const saved = localStorage.getItem("magic-star-position");
    if (saved) {
      setPosition(JSON.parse(saved));
    }
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    const newY = Math.max(60, Math.min(window.innerHeight - 120, info.point.y));
    const newPosition = { x: 0, y: newY - window.innerHeight / 2 };
    setPosition(newPosition);
    localStorage.setItem("magic-star-position", JSON.stringify(newPosition));
  };

  if (isOpen) return null;

  return (
    <motion.div
      className="fixed right-6 z-50"
      style={{ bottom: `calc(50vh + ${position.y}px)` }}
      drag="y"
      dragConstraints={{ top: -window.innerHeight / 2 + 60, bottom: window.innerHeight / 2 - 120 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layoutId="magic-star"
    >
      <motion.button
        onClick={onClick}
        className="w-14 h-14 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center magic-glow"
        whileHover={{ rotate: 15 }}
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(99, 102, 241, 0.3)",
            "0 0 30px rgba(99, 102, 241, 0.6)",
            "0 0 20px rgba(99, 102, 241, 0.3)"
          ]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles className="text-white w-5 h-5 magic-star-pulse" />
        
        {/* Orbit ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.button>
    </motion.div>
  );
}
