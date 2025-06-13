import { Link } from "wouter";
import { Zap } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { LanguageSearch } from "./LanguageSearch";
import { useTranslation } from "@/hooks/useTranslation";

export function AppHeader() {
  const { translateText } = useTranslation();

  return (
    <header className="px-6 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-tf-accent-gradient rounded-lg flex items-center justify-center shadow-tf-halo">
            <Zap className="text-tf-dark w-4 h-4" />
          </div>
          <span className="text-xl font-semibold text-tf-text dark:text-tf-text-dark">TalentFlux</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Already a member?{" "}
            <Link href="/login" className="text-tf-accent hover:text-tf-accent/80 hover:underline font-medium transition-colors">
              Login here
            </Link>
          </p>
          
          {/* Language Search Selector */}
          <LanguageSearch />

          {/* Theme Switch */}
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  );
}