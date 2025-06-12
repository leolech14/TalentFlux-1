import { motion } from "framer-motion";
import { Link } from "wouter";
import { Brain, MessageCircle, TrendingUp, Zap, User, Building, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/useTheme";

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-semibold text-foreground">TalentFlux</span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                isDark 
                  ? "bg-zinc-800 hover:bg-zinc-700 text-yellow-400 hover:text-yellow-300" 
                  : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-700 border border-slate-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </motion.button>
            <Link href="/login">
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                Sign In
              </Button>
            </Link>
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              AI-native HR made human.
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Streamline your hiring process with intelligent automation while keeping the human touch. 
              Connect talent with opportunity through AI-powered insights.
            </p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/login">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 px-8 py-4">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Join as a Candidate</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="group border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 px-8 py-4"
              >
                <Building className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
                <span>Join as an Employer</span>
              </Button>
            </Link>
          </motion.div>
          
          {/* Features Preview */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-cyan-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Matching</h3>
              <p className="text-slate-600">Smart algorithms connect the right talent with the right opportunities.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Conversational Interface</h3>
              <p className="text-slate-600">Interact naturally with your AI assistant for all HR tasks.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analytics & Insights</h3>
              <p className="text-slate-600">Data-driven insights to optimize your hiring process.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
