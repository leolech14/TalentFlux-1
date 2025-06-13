import { Link } from "wouter";
import { Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

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
            {t('alreadyMember')}{" "}
            <Link href="/login" className="text-tf-accent hover:text-tf-accent/80 hover:underline font-medium transition-colors">
              {t('loginHere')}
            </Link>
          </p>
          
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="uppercase text-xs font-medium">
                  {language}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-accent' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('pt')}
                className={language === 'pt' ? 'bg-accent' : ''}
              >
                Português
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switch */}
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  );
}