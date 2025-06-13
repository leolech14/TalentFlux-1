import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Brain, MessageCircle, TrendingUp, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { MagicalCVButton } from "@/features/cv/MagicalCVButton";
import { useTranslation } from "@/hooks/useLanguage";

export default function Landing() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

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
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
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
              <span>{t('candidateButton')}</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 px-8 py-4"
              onClick={() => navigate('/login')}
            >
              <Building className="w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
              <span>{t('employerButton')}</span>
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
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">{t('aiMatching')}</h3>
              <p className="text-muted-foreground">{t('aiMatchingDesc')}</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">{t('conversationalInterface')}</h3>
              <p className="text-muted-foreground">{t('conversationalDesc')}</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">{t('analyticsInsights')}</h3>
              <p className="text-muted-foreground">{t('analyticsDesc')}</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
