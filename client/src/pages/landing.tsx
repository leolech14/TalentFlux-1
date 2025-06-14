import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Brain, MessageCircle, TrendingUp, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { MagicalCVButton } from "@/features/cv/MagicalCVButton";
import { useLanguageContext } from "@/components/LanguageContext";
import { TranslatedText } from "@/components/TranslatedText";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 text-foreground transition-colors duration-300">
      {/* Header */}
      <AppHeader />
      
      {/* Hero Section */}
      <main className="relative px-6 py-20 overflow-hidden">
        {/* Enhanced Gradient Backlight */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary gradient orb */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-40">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-purple-500/20 to-transparent blur-3xl"></div>
          </div>
          
          {/* Secondary accent gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-pink-500/20 via-purple-400/10 to-transparent blur-2xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-blue-500/15 via-cyan-400/10 to-transparent blur-2xl opacity-50"></div>
          
          {/* Animated floating orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-yellow-400/20 via-orange-400/10 to-transparent blur-xl"
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-radial from-purple-500/25 via-pink-400/15 to-transparent blur-xl"
            animate={{
              x: [0, -60, 40, 0],
              y: [0, 30, -50, 0],
              scale: [1, 0.7, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Mesh gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight minimal:font-normal">
              <span className="text-foreground font-extrabold minimal:font-normal minimal:text-white" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)' }}>Connect </span>
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-black minimal:bg-none minimal:text-white minimal:font-normal" 
                    style={{ filter: 'brightness(1.6) saturate(1.8)' }}>
                Talent
              </span>
              <br />
              <span className="text-foreground font-extrabold minimal:font-normal minimal:text-white" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>with </span>
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-black minimal:bg-none minimal:text-white minimal:font-normal"
                    style={{ filter: 'brightness(1.6) saturate(1.8)' }}>
                Opportunity
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed" 
               style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <TranslatedText text="The AI-powered platform that brings together talented professionals and innovative companies for perfect career matches." />
            </p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 px-8 py-4"
              onClick={() => navigate('/login')}
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <TranslatedText text="I'm a Candidate" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group bg-background/90 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-200 flex items-center space-x-2 px-8 py-4 shadow-md hover:shadow-lg"
              onClick={() => navigate('/login')}
              style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <Building className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
              <TranslatedText text="I'm an Employer" />
            </Button>
          </motion.div>
          
          {/* Features Preview */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-cyan-400/10 dark:bg-cyan-400/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-cyan-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                <TranslatedText text="AI-Powered Matching" />
              </h3>
              <p className="text-muted-foreground">
                <TranslatedText text="Advanced algorithms analyze skills, experience, and cultural fit to create perfect matches between candidates and companies." />
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                <TranslatedText text="Conversational Interface" />
              </h3>
              <p className="text-muted-foreground">
                <TranslatedText text="Interact naturally with our AI assistant to build profiles, search opportunities, and get personalized recommendations." />
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                <TranslatedText text="Analytics & Insights" />
              </h3>
              <p className="text-muted-foreground">
                <TranslatedText text="Data-driven insights help optimize hiring processes and career development with real-time market intelligence." />
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
