import { api } from '@/lib/api';

// OpenAI text-to-speech supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' }
];

interface TranslationCache {
  [key: string]: { [text: string]: string };
}

class TranslationService {
  private cache: TranslationCache = {};
  private currentLanguage = 'en';

  setLanguage(languageCode: string) {
    this.currentLanguage = languageCode;
    localStorage.setItem('selectedLanguage', languageCode);
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getLanguageFromStorage() {
    return localStorage.getItem('selectedLanguage') || 'en';
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en' || !text.trim()) {
      return text;
    }

    const cacheKey = `${targetLanguage}-${text}`;
    if (this.cache[targetLanguage]?.[text]) {
      return this.cache[targetLanguage][text];
    }

    try {
      const response = await api.translation.translate(text, targetLanguage);

      if (!this.cache[targetLanguage]) {
        this.cache[targetLanguage] = {};
      }
      this.cache[targetLanguage][text] = response.translatedText;

      return response.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  async translateBatch(texts: string[], targetLanguage: string): Promise<string[]> {
    if (targetLanguage === 'en') {
      return texts;
    }

    try {
      const response = await api.translation.translateBatch(texts, targetLanguage);

      // Cache the results
      if (!this.cache[targetLanguage]) {
        this.cache[targetLanguage] = {};
      }
      
      texts.forEach((text, index) => {
        if (response.translations[index]) {
          this.cache[targetLanguage][text] = response.translations[index];
        }
      });

      return response.translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Fallback to original texts
    }
  }

  searchLanguages(query: string): typeof SUPPORTED_LANGUAGES {
    if (!query.trim()) return SUPPORTED_LANGUAGES;
    
    const lowercaseQuery = query.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(lang => 
      lang.name.toLowerCase().includes(lowercaseQuery) ||
      lang.nativeName.toLowerCase().includes(lowercaseQuery) ||
      lang.code.toLowerCase().includes(lowercaseQuery)
    );
  }

  getLanguageByCode(code: string) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }
}

export const translationService = new TranslationService();