import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageSelector() {
  const [showBanner, setShowBanner] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // Check if user has already made a language choice
    const hasChosenLanguage = localStorage.getItem("language-chosen");
    
    if (!hasChosenLanguage) {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("pt")) {
        setTimeout(() => setShowBanner(true), 2000);
      }
    }
  }, []);

  const handleLanguageChange = (lang: "en" | "pt") => {
    setLanguage(lang);
    localStorage.setItem("language-chosen", "true");
    setShowBanner(false);
  };

  return (
    <>
      {/* Language Toggle Button */}
      <motion.button
        className="fixed top-4 right-20 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage(language === "en" ? "pt" : "en")}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {language === "en" ? "EN" : "PT"}
          </span>
        </div>
      </motion.button>

      {/* Language Selection Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-purple-500/20 shadow-2xl">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-yellow-500/20">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Prefere em Português?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Detectamos que você fala português
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white"
                    onClick={() => handleLanguageChange("pt")}
                  >
                    Sim, usar Português
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleLanguageChange("en")}
                  >
                    Keep English
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 