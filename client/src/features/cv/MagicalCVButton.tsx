import { motion } from "framer-motion";
import { Sparkles, Mic, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function MagicalCVButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const navigate = useNavigate();

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
    // Navigate to CV Assistant
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
          opacity: isHovered ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ x: 0, y: 0, opacity: 1 }}
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
        className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-2xl overflow-hidden group"
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
            x: [-200, 200],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
        />

        {/* Button content */}
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Wand2 className="w-6 h-6" />
          </motion.div>
          
          <span className="text-lg font-bold">Create Your CV with AI Magic</span>
          
          <motion.div
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              repeat: isHovered ? Infinity : 0,
              duration: 1,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeOut",
          }}
        />
      </motion.button>

      {/* Floating icons */}
      <motion.div
        className="absolute -top-8 -right-8"
        animate={{
          y: [-5, 5, -5],
          rotate: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      >
        <Mic className="w-8 h-8 text-purple-400" />
      </motion.div>

      <motion.div
        className="absolute -bottom-8 -left-8"
        animate={{
          y: [5, -5, 5],
          rotate: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Sparkles className="w-8 h-8 text-pink-400" />
      </motion.div>
    </motion.div>
  );
} 