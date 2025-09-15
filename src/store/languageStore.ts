import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Language {
  code: string;
  name: string;
  countryCode: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', countryCode: 'US' },
  { code: 'zh', name: '中文', countryCode: 'CN' },
  { code: 'hi', name: 'हिन्दी', countryCode: 'IN' },
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'ar', name: 'العربية', countryCode: 'SA' },
  { code: 'bn', name: 'বাংলা', countryCode: 'BD' },
  { code: 'ru', name: 'Русский', countryCode: 'RU' },
  { code: 'pt', name: 'Português', countryCode: 'BR' },
  { code: 'id', name: 'Bahasa Indonesia', countryCode: 'ID' },
  { code: 'ur', name: 'اردو', countryCode: 'PK' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'ja', name: '日本語', countryCode: 'JP' },
  { code: 'sw', name: 'Kiswahili', countryCode: 'TZ' },
  { code: 'mr', name: 'मराठी', countryCode: 'IN' },
  { code: 'te', name: 'తెలుగు', countryCode: 'IN' },
  { code: 'tr', name: 'Türkçe', countryCode: 'TR' },
  { code: 'ta', name: 'தமிழ்', countryCode: 'IN' },
  { code: 'vi', name: 'Tiếng Việt', countryCode: 'VN' },
  { code: 'ko', name: '한국어', countryCode: 'KR' },
];

interface LanguageStore {
  currentLanguage: string;
  setLanguage: (languageCode: string) => void;
  getCurrentLanguage: () => Language;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      setLanguage: (languageCode: string) => {
        if (SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode)) {
          set({ currentLanguage: languageCode });
        }
      },
      getCurrentLanguage: () => {
        const currentCode = get().currentLanguage;
        return SUPPORTED_LANGUAGES.find(lang => lang.code === currentCode) || SUPPORTED_LANGUAGES[0];
      },
    }),
    {
      name: 'spacex-language-storage',
    }
  )
);