import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Brain, MessageCircle, TrendingUp, Zap, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { MagicalCVButton } from "@/features/cv/MagicalCVButton";

export default function Landing() {
  const { theme } = useTheme();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-tf-accent-gradient rounded-lg flex items-center justify-center shadow-tf-halo">
              <Zap className="text-tf-dark w-4 h-4" />
            </div>
            <span className="text-xl font-semibold text-tf-text dark:text-tf-text-dark">TalentFlux</span>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Already a member?{" "}
              <Link href="/login" className="text-tf-accent hover:text-tf-accent/80 hover:underline font-medium transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </nav>
      </header>
      
      {/* Hero Section */}
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-tf-text dark:from-tf-text-dark to-tf-accent bg-clip-text text-transparent">
              AI-native HR made human.
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Streamline your hiring process with intelligent automation while keeping the human touch. 
              Connect talent with opportunity through AI-powered insights.
            </p>
          </motion.div>
          
          {/* Magical CV Button */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MagicalCVButton />
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
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>I'm a Candidate</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 px-8 py-4"
              onClick={() => navigate('/login')}
            >
              <Building className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
              <span>I'm an Employer</span>
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
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">AI-Powered Matching</h3>
              <p className="text-muted-foreground">Smart algorithms connect the right talent with the right opportunities.</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">Conversational Interface</h3>
              <p className="text-muted-foreground">Interact naturally with your AI assistant for all HR tasks.</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">Analytics & Insights</h3>
              <p className="text-muted-foreground">Data-driven insights to optimize your hiring process.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
