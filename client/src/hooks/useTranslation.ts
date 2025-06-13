import { useState, useEffect, useCallback } from 'react';
import { translationService, SUPPORTED_LANGUAGES } from '@/services/translationService';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState(translationService.getLanguageFromStorage());
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    translationService.setLanguage(currentLanguage);
  }, [currentLanguage]);

  const translateText = useCallback(async (text: string): Promise<string> => {
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
  }, [currentLanguage]);

  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (currentLanguage === 'en') {
      return texts;
    }

    setIsTranslating(true);
    try {
      const translated = await translationService.translateBatch(texts, currentLanguage);
      return translated;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage]);

  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
  }, []);

  const getCurrentLanguageInfo = useCallback(() => {
    return translationService.getLanguageByCode(currentLanguage);
  }, [currentLanguage]);

  const t = translateText;

  return {
    currentLanguage,
    changeLanguage,
    translateText,
    translateBatch,
    getCurrentLanguageInfo,
    isTranslating,
    supportedLanguages: SUPPORTED_LANGUAGES,
    t
  };
}

// Hook for component-level translation with automatic re-rendering
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

// Hook for batch translation
export function useTranslatedTexts(texts: string[]): string[] {
  const { translateBatch, currentLanguage } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState(texts);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedTexts(texts);
      return;
    }

    translateBatch(texts).then(setTranslatedTexts);
  }, [texts, translateBatch, currentLanguage]);

  return translatedTexts;
}