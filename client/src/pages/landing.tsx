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
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-tf-text dark:from-tf-text-dark to-tf-accent bg-clip-text text-transparent">
              <TranslatedText text="Connect Talent with Opportunity" />
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
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
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <TranslatedText text="I'm a Candidate" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 px-8 py-4"
              onClick={() => navigate('/login')}
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
