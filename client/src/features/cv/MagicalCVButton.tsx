import { motion } from "framer-motion";
import { Sparkles, Mic, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TranslatedText } from "@/components/TranslatedText";

export function MagicalCVButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-10),
          {
            id: Date.now(),
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
          }
        ]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const handleClick = () => {
    navigate('/cv-assistant');
  };

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl"
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.8 : 0.6,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 1,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ left: "50%", top: "50%" }}
        />
      ))}

      {/* Main button */}
      <motion.button
        className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-sm shadow-2xl overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: isHovered ? ["0%", "200%"] : "0%",
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        />

        {/* Button content */}
        <div className="relative flex items-center gap-2">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Wand2 className="w-4 h-4" />
          </motion.div>
          
          <span className="text-sm font-bold">
            <TranslatedText text="Create Magical CV" />
          </span>
          
          <motion.div
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              repeat: isHovered ? Infinity : 0,
              duration: 1,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            scale: isHovered ? [1, 1.4] : 1,
            opacity: isHovered ? [0.5, 0] : 0.5,
          }}
          transition={{
            duration: 1,
            repeat: isHovered ? Infinity : 0,
            ease: "easeOut",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          animate={{
            scale: isHovered ? [1, 1.8] : 1,
            opacity: isHovered ? [0.3, 0] : 0.3,
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "easeOut",
            delay: 0.2,
          }}
        />
      </motion.button>

      {/* Floating icons */}
      <motion.div
        className="absolute -top-8 -right-4 text-yellow-400"
        animate={{
          y: isHovered ? [-5, 5, -5] : 0,
          rotate: isHovered ? [0, 10, -10, 0] : 0,
          opacity: isHovered ? 1 : 0.7,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <Mic className="w-4 h-4" />
      </motion.div>

      <motion.div
        className="absolute -bottom-6 -left-6 text-pink-400"
        animate={{
          y: isHovered ? [5, -5, 5] : 0,
          rotate: isHovered ? [0, -15, 15, 0] : 0,
          opacity: isHovered ? 1 : 0.7,
        }}
        transition={{
          duration: 3,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Sparkles className="w-5 h-5 text-pink-400" />
      </motion.div>
    </motion.div>
  );
}