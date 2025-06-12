import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { Star } from "lucide-react";
import { useDock } from "../hooks/useDock";
import { useTheme } from "../hooks/useTheme";
import { useUIState } from "../hooks/useUIState";
import { registerSingleton, unregisterSingleton } from "../lib/SingletonRegistry";
import { useEffect, useRef, useState } from "react";

interface MagicStarButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function MagicStarButton({ onClick, isOpen }: MagicStarButtonProps) {
  const { position, updatePosition } = useDock();
  const { theme } = useTheme();
  const { assistantOpen, sidebarOpen } = useUIState();
  const controls = useAnimation();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(position.y);
  
  // Physics constants
  const FRICTION = 0.92;
  const BOUNCE_DAMPING = 0.6;
  const BUTTON_SIZE = 56; // 14 * 4 (w-14 in pixels)

  useEffect(() => {
    registerSingleton("magic-star");
    return () => unregisterSingleton("magic-star");
  }, []);

  // Apply physics simulation
  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
        // Apply friction
        setVelocity(v => ({
          x: v.x * FRICTION,
          y: v.y * FRICTION
        }));
        
        // Update position based on velocity
        const currentX = x.get();
        const currentY = y.get();
        
        // Check boundaries and bounce
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxX = viewportWidth / 2 - BUTTON_SIZE - 24; // 24px margin
        const minX = -viewportWidth / 2 + BUTTON_SIZE / 2 + 24;
        const maxY = viewportHeight / 2 - BUTTON_SIZE - 80; // Account for header
        const minY = -viewportHeight / 2 + BUTTON_SIZE / 2 + 120; // Account for footer
        
        let newX = currentX + velocity.x;
        let newY = currentY + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        
        // Bounce off edges
        if (newX > maxX || newX < minX) {
          newVelX = -velocity.x * BOUNCE_DAMPING;
          newX = newX > maxX ? maxX : minX;
        }
        if (newY > maxY || newY < minY) {
          newVelY = -velocity.y * BOUNCE_DAMPING;
          newY = newY > maxY ? maxY : minY;
        }
        
        x.set(newX);
        y.set(newY);
        setVelocity({ x: newVelX, y: newVelY });
        
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [velocity, x, y]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    // Set velocity based on drag velocity
    setVelocity({
      x: info.velocity.x * 0.5,
      y: info.velocity.y * 0.5
    });
    
    // Save position
    updatePosition({ y: y.get() });
  };

  // Transform for glass morphism effect
  const rotateX = useTransform(y, [-200, 200], [-15, 15]);
  const scale = useTransform(x, [-100, 100], [0.95, 1.05]);

  // Hide FAB when any overlay/sidebar is open
  if (isOpen || assistantOpen || sidebarOpen) return null;

  // TalentFlux dynamic styling based on theme
  const fabStyles = theme === 'light'
    ? "bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500"
    : theme === 'alt'
    ? "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"
    : "bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-600";

  const glowColor = theme === 'alt' 
    ? "rgba(199, 125, 255, 0.4)" 
    : "rgba(255, 210, 0, 0.25)";

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
      drag
      dragElastic={0.2}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      layoutId="magic-star"
      data-singleton="magic-star"
      data-testid="magic-star-fab"
    >
      <motion.button
        onClick={onClick}
        className={`relative w-14 h-14 ${fabStyles} rounded-full shadow-2xl backdrop-blur-md overflow-hidden group`}
        animate={{ 
          boxShadow: [
            `0 0 20px ${glowColor}, 0 10px 40px rgba(0,0,0,0.3)`,
            `0 0 30px ${glowColor}, 0 15px 50px rgba(0,0,0,0.4)`,
            `0 0 20px ${glowColor}, 0 10px 40px rgba(0,0,0,0.3)`
          ]
        }}
        transition={{ 
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full" />
        
        {/* Inner glow */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)`
          }}
        />
        
        {/* Star icon with animation */}
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-6 h-6 text-white fill-white drop-shadow-lg" />
        </motion.div>
        
        {/* Orbit ring with physics response */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Particle effects */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [0, (i - 1) * 20, 0],
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.button>
    </motion.div>
  );
}
