'use client';

import { usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '../types/language';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spacelaunchdb.com';

export function HrefLangTags() {
  const pathname = usePathname();

  // Extract the base path without language prefix
  const segments = pathname.split('/').filter(Boolean);
  const basePath = segments.length > 1 ? '/' + segments.slice(1).join('/') : '/';

  return (
    <>
      {/* Canonical URL pointing to English version */}
      <link rel="canonical" href={`${SITE_URL}/en${basePath === '/' ? '' : basePath}`} />

      {/* Hreflang tags for each supported language */}
      {SUPPORTED_LANGUAGES.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${SITE_URL}/${lang}${basePath === '/' ? '' : basePath}`}
        />
      ))}

      {/* x-default hreflang pointing to English */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${SITE_URL}/en${basePath === '/' ? '' : basePath}`}
      />
    </>
  );
}