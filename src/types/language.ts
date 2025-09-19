export type SupportedLanguage = 'en' | 'es' | 'fr' | 'zh' | 'ja' | 'de' | 'da' | 'it';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr', 'zh', 'ja', 'de', 'da', 'it'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function validateLanguage(lang: string): SupportedLanguage {
  if (isSupportedLanguage(lang)) {
    return lang;
  }
  return DEFAULT_LANGUAGE;
}

export function detectBestLanguage(acceptLanguage: string | null): SupportedLanguage {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;

  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())
    .map(lang => lang.split('-')[0]); // Handle language-region codes like en-US

  const detectedLang = languages.find(lang =>
    SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
  );

  return (detectedLang as SupportedLanguage) || DEFAULT_LANGUAGE;
}

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  countryCode: string;
}

export const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  en: { code: 'en', name: 'English', countryCode: 'US' },
  es: { code: 'es', name: 'Español', countryCode: 'ES' },
  fr: { code: 'fr', name: 'Français', countryCode: 'FR' },
  zh: { code: 'zh', name: '中文', countryCode: 'CN' },
  ja: { code: 'ja', name: '日本語', countryCode: 'JP' },
  de: { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  da: { code: 'da', name: 'Dansk', countryCode: 'DK' },
  it: { code: 'it', name: 'Italiano', countryCode: 'IT' },
};
