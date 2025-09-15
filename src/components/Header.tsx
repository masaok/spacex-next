'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguageStore, SUPPORTED_LANGUAGES } from '../store/languageStore';
import { getTranslation } from '../translations/translations';
import { APP_NAME } from '../config/app.config';
import Image from 'next/image';

export default function Header() {
  const { currentLanguage, setLanguage, getCurrentLanguage } = useLanguageStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = getTranslation(currentLanguage);
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-black border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              {APP_NAME}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/launches"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {t.header.launches}
            </Link>
            <Link
              href="/vehicles"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {t.header.vehicles}
            </Link>
            <Link
              href="/capsules"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {t.header.capsules}
            </Link>
            <Link
              href="/crew"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {t.header.crew}
            </Link>
            <Link
              href="/cores"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {t.header.cores}
            </Link>
            <Link
              href="/company"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              {t.header.company}
            </Link>
            <Link
              href="/roadster"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              🚗 Roadster
            </Link>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <Image
                  src={`https://flagcdn.com/24x18/${currentLang.countryCode.toLowerCase()}.png`}
                  alt={`${currentLang.name} flag`}
                  width={24}
                  height={18}
                  className="rounded-sm"
                />
                <span>{currentLang.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="py-1">
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center space-x-3 w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                          currentLanguage === language.code
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        <Image
                          src={`https://flagcdn.com/20x15/${language.countryCode.toLowerCase()}.png`}
                          alt={`${language.name} flag`}
                          width={20}
                          height={15}
                          className="rounded-sm"
                        />
                        <span>{language.name}</span>
                        {currentLanguage === language.code && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isDropdownOpen && (
          <div className="md:hidden border-t border-gray-800 pt-4 pb-4">
            <div className="space-y-2">
              <Link
                href="/launches"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t.header.launches}
              </Link>
              <Link
                href="/vehicles"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t.header.vehicles}
              </Link>
              <Link
                href="/capsules"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t.header.capsules}
              </Link>
              <Link
                href="/crew"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t.header.crew}
              </Link>
              <Link
                href="/cores"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t.header.cores}
              </Link>
              <Link
                href="/company"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t.header.company}
              </Link>
              <Link
                href="/roadster"
                className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                🚗 {t.header.roadster}
              </Link>

              {/* Mobile Language Selection */}
              <div className="pt-2 border-t border-gray-800 mt-2">
                <p className="text-sm text-gray-400 mb-2">Language / भाषा / 语言</p>
                <div className="grid grid-cols-2 gap-1">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`flex items-center space-x-2 p-2 text-left text-sm rounded transition-colors ${
                        currentLanguage === language.code
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Image
                        src={`https://flagcdn.com/16x12/${language.countryCode.toLowerCase()}.png`}
                        alt={`${language.name} flag`}
                        width={16}
                        height={12}
                        className="rounded-sm"
                      />
                      <span className="text-xs">{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}