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
  { code: 'es', name: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'ja', name: '日本語', countryCode: 'JP' },
  { code: 'da', name: 'Dansk', countryCode: 'DK' },
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
