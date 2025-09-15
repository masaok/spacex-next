import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
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