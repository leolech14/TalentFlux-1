import { motion } from "framer-motion";
import { Zap, Brain, MessageSquare, BarChart3, Mic, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MagicalCVButton } from "@/features/cv/MagicalCVButton";
import { AppHeader } from "@/components/AppHeader";
import { useTranslation } from "@/hooks/useLanguage";

export default function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t('aiMatching'),
      description: t('aiMatchingDesc'),
    },
    {
      icon: MessageSquare,
      title: t('conversationalInterface'),
      description: t('conversationalDesc'),
    },
    {
      icon: BarChart3,
      title: t('analyticsInsights'),
      description: t('analyticsDesc'),
    },
    {
      icon: Mic,
      title: t('voiceEnabled'),
      description: t('voiceEnabledDesc'),
    },
    {
      icon: TrendingUp,
      title: t('realTimeAnalytics'),
      description: t('realTimeAnalyticsDesc'),
    },
    {
      icon: Users,
      title: t('smartMatching'),
      description: t('smartMatchingDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient-safe">
                {t('heroTitle')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="btn-primary-safe text-lg px-8 py-4 h-auto"
              >
                {t('candidateButton')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-outline-safe text-lg px-8 py-4 h-auto"
              >
                {t('employerButton')}
              </Button>
            </div>

            {/* CV Creation Button */}
            <div className="flex justify-center">
              <MagicalCVButton />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('analyticsDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('getStarted')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary-safe text-lg px-8 py-4 h-auto">
                {t('getStarted')}
              </Button>
              <Button size="lg" variant="outline" className="btn-outline-safe text-lg px-8 py-4 h-auto">
                {t('learnMore')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                TalentFlux
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 TalentFlux. {t('allRightsReserved')}</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('privacyPolicy')}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('termsOfService')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
