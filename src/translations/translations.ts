import { en } from './en';
import { es } from './es';
import { zh } from './zh';
import { ja } from './ja';

// Simplified translations object with essential languages
export const translations = {
  en,
  es,
  zh,
  ja,
  // For now, other languages will fallback to English
  hi: en,
  fr: en,
  ar: en,
  bn: en,
  ru: en,
  pt: en,
  id: en,
  ur: en,
  de: en,
  sw: en,
  mr: en,
  te: en,
  tr: en,
  ta: en,
  vi: en,
  ko: en,
};

export const getTranslation = (languageCode: string) => {
  return translations[languageCode as keyof typeof translations] || translations.en;
};