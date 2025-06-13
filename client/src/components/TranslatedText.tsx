import { useTranslatedText } from './LanguageContext';

interface TranslatedTextProps {
  text: string;
  className?: string;
}

export function TranslatedText({ text, className }: TranslatedTextProps) {
  const translatedText = useTranslatedText(text);
  
  return <span className={className}>{translatedText}</span>;
}