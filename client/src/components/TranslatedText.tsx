import { useTranslatedText } from '@/hooks/useTranslation';

interface TranslatedTextProps {
  text: string;
  className?: string;
}

export function TranslatedText({ text, className }: TranslatedTextProps) {
  const translatedText = useTranslatedText(text);
  
  return <span className={className}>{translatedText}</span>;
}