import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translationService } from '@/services/translationService';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (languageCode: string) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(() => 
    translationService.getLanguageFromStorage()
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const changeLanguage = async (languageCode: string) => {
    setCurrentLanguage(languageCode);
    translationService.setLanguage(languageCode);
    
    // Force a re-render of all translated components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
  };

  // Listen for language changes from other parts of the app (like useLanguage hook)
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language;
      if (newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
        translationService.setLanguage(newLanguage);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
  }, [currentLanguage]);

  const translateText = async (text: string): Promise<string> => {
    if (currentLanguage === 'en' || !text.trim()) {
      return text;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateText(text, currentLanguage);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    translationService.setLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      translateText,
      isTranslating
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}

// Hook for automatic translation of text with re-rendering on language change
export function useTranslatedText(text: string): string {
  const { currentLanguage, translateText } = useLanguageContext();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    setIsLoading(true);
    translateText(text).then((result) => {
      setTranslatedText(result);
      setIsLoading(false);
    });
  }, [text, currentLanguage, translateText]);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = () => {
      if (currentLanguage === 'en') {
        setTranslatedText(text);
      } else {
        setIsLoading(true);
        translateText(text).then((result) => {
          setTranslatedText(result);
          setIsLoading(false);
        });
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [text, currentLanguage, translateText]);

  return isLoading ? text : translatedText;
}