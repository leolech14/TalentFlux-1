// This file is deprecated - use useTranslation hook instead
// Kept for backward compatibility but all exports redirect to useTranslation

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function useLanguageContext() {
  return useTranslation();
}

export function useTranslatedText(text: string): string {
  const { translateText, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    translateText(text).then(setTranslatedText);
  }, [text, translateText, currentLanguage]);

  return translatedText;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}