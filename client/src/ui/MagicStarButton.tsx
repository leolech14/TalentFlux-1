import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useDock } from "../hooks/useDock";
import { useTheme } from "../hooks/useTheme";
import { useUIState } from "../hooks/useUIState";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";
import { useEffect } from "react";

interface MagicStarButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function MagicStarButton({ onClick, isOpen }: MagicStarButtonProps) {
  const { position, updatePosition } = useDock();
  const { isDark } = useTheme();
  const { assistantOpen, sidebarOpen } = useUIState();

  useEffect(() => {
    registerSingleton("magic-star");
    return () => unregisterSingleton("magic-star");
  }, []);

  // Clamping utility to keep FAB within safe bounds
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const headerHeight = 80; // Account for header
  const footerSafe = 120;  // Keep above bottom UI + safe area

  const handleDragEnd = (event: any, info: any) => {
    const viewportY = info.point.y - window.innerHeight / 2;
    const clampedY = clamp(
      viewportY,
      -window.innerHeight / 2 + headerHeight,
      window.innerHeight / 2 - footerSafe
    );
    updatePosition({ y: clampedY });
  };

  // Hide FAB when any overlay/sidebar is open
  if (isOpen || assistantOpen || sidebarOpen) return null;

  // TalentFlux dynamic styling based on theme
  const fabStyles = isDark 
    ? "bg-tf-accent shadow-tf-halo" 
    : "bg-tf-accent-gradient shadow-tf-halo";
  
  const glowColor = "rgba(255, 210, 0, 0.25)";

  const orbitColor = isDark 
    ? "border-tf-accent/30" 
    : "border-tf-accent/30";

  return (
    <motion.div
      className="fixed right-6 md:right-8 z-50 cursor-grab active:cursor-grabbing"
      style={{ 
        bottom: `calc(50vh + ${position.y}px + env(safe-area-inset-bottom))`,
        marginBottom: "max(1.5rem, env(safe-area-inset-bottom))"
      }}
      drag="y"
      dragConstraints={{ 
        top: -window.innerHeight / 2 + 60, 
        bottom: window.innerHeight / 2 - 120 
      }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layoutId="magic-star"
      data-singleton="magic-star"
      data-testid="magic-star-fab"
    >
      <motion.button
        onClick={onClick}
        className={`w-14 h-14 ${fabStyles} rounded-full hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden`}
        whileHover={{ rotate: 15 }}
        animate={{ 
          boxShadow: [
            `0 0 20px ${glowColor}`,
            `0 0 30px ${glowColor}`,
            `0 0 20px ${glowColor}`
          ]
        }}
        transition={{ 
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* 4-point Star SVG */}
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-tf-dark z-10"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 2l2.09 6.26L20 10.27l-5.91 2.01L12 22l-2.09-9.72L4 10.27l5.91-2.01L12 2z" />
        </motion.svg>
        
        {/* Orbit ring */}
        <motion.div 
          className={`absolute inset-0 rounded-full border-2 ${orbitColor}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulse ring */}
        <motion.div 
          className={`absolute inset-2 rounded-full border ${orbitColor}`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.button>
    </motion.div>
  );
}
