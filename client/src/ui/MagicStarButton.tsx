import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useUIState } from "@/hooks/useUIState";

interface MagicStarButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function MagicStarButton({ onClick, isOpen }: MagicStarButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { assistantOpen, sidebarOpen } = useUIState();
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for smooth dragging
  const x = useMotionValue(0);
  const y = useMotionValue((() => {
    const saved = localStorage.getItem("magicStarY");
    return saved ? parseInt(saved) : 0;
  })());

  // Smooth spring animations
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(y, [-100, 100], [15, -15]);

  // Clamp function to keep FAB within bounds
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleDragEnd = () => {
    setIsDragging(false);
    const headerHeight = 80;
    const footerSafe = 100;
    const windowHeight = window.innerHeight;
    
    // Clamp Y position within safe bounds
    const currentY = y.get();
    const clampedY = clamp(currentY, -windowHeight/2 + headerHeight, windowHeight/2 - footerSafe);
    y.set(clampedY);
    
    // Save position
    localStorage.setItem("magicStarY", clampedY.toString());
    
    // Reset X position (only vertical dragging)
    x.set(0);
  };

  // Hide FAB when any overlay/sidebar is open
  if (isOpen || assistantOpen || sidebarOpen) return null;

  // Clean theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          glow: "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)",
          border: "rgba(255, 255, 255, 0.2)"
        };
      case 'dark':
        return {
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          glow: "0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2)",
          border: "rgba(255, 255, 255, 0.1)"
        };
      case 'alt':
        return {
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          glow: "0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)",
          border: "rgba(255, 255, 255, 0.15)"
        };
      case 'minimal':
        return {
          background: "linear-gradient(135deg, #374151, #6b7280)",
          glow: "0 0 15px rgba(55, 65, 81, 0.3)",
          border: "rgba(255, 255, 255, 0.1)"
        };
      default:
        return {
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          glow: "0 0 20px rgba(59, 130, 246, 0.3)",
          border: "rgba(255, 255, 255, 0.2)"
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <motion.div
      ref={buttonRef}
      className="fixed z-50 cursor-grab active:cursor-grabbing"
      style={{ 
        x,
        y,
        right: 24,
        bottom: "50vh",
        rotateX,
        scale,
        perspective: 1000
      }}
      drag="y"
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layoutId="magic-star"
      data-singleton="magic-star"
      data-testid="magic-star-fab"
    >
      {/* Main FAB Button */}
      <motion.button
        onClick={onClick}
        className="relative w-14 h-14 rounded-full overflow-hidden backdrop-blur-sm"
        style={{
          background: themeStyles.background,
          boxShadow: themeStyles.glow,
          border: `1px solid ${themeStyles.border}`
        }}
        animate={{
          boxShadow: isDragging 
            ? `${themeStyles.glow}, 0 8px 32px rgba(0, 0, 0, 0.2)`
            : themeStyles.glow
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle inner glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
        </motion.div>

        {/* Subtle pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Floating particles - minimal and elegant */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            y: [-10, -20, -10],
            x: [-5, 5, -5],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
    </motion.div>
  );
}
