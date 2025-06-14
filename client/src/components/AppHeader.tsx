import { Link } from "wouter";
import { Zap } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";

export function AppHeader() {
  const { translateText } = useTranslation();

  return (
    <header className="px-6 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent" 
                style={{ filter: 'brightness(1.4) saturate(1.5)' }}>TalentFlux</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Already a member?{" "}
            <Link href="/login" className="text-tf-accent hover:text-tf-accent/80 hover:underline font-medium transition-colors">
              Login here
            </Link>
          </p>
          
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Theme Switch */}
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  );
}