import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type SupportedLanguage, LANGUAGE_CONFIGS, isSupportedLanguage } from '../types/language';

interface LanguageStore {
  currentLanguage: SupportedLanguage;
  setLanguage: (languageCode: SupportedLanguage) => void;
  getCurrentLanguage: () => typeof LANGUAGE_CONFIGS[SupportedLanguage];
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      setLanguage: (languageCode: SupportedLanguage) => {
        if (isSupportedLanguage(languageCode)) {
          set({ currentLanguage: languageCode });
        }
      },
      getCurrentLanguage: () => {
        const currentCode = get().currentLanguage;
        return LANGUAGE_CONFIGS[currentCode] || LANGUAGE_CONFIGS.en;
      },
    }),
    {
      name: 'spacex-language-storage',
    }
  )
);
