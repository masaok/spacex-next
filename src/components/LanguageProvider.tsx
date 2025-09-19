'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { type SupportedLanguage } from '../types/language';

interface LanguageProviderProps {
  lang: SupportedLanguage;
  children: React.ReactNode;
}

export function LanguageProvider({ lang, children }: LanguageProviderProps) {
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    // Sync the Zustand store with the URL language
    setLanguage(lang);
  }, [lang, setLanguage]);

  return <>{children}</>;
}