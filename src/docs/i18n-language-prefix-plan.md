# Language-Prefixed Routes Plan (App Router)

Goal
- Make the first path segment the language code; e.g., `/fr/cores` instead of `/cores`.
- Keep client-side language switching working and align translations with the URL.
- Ensure type safety and robust error handling throughout.

Scope
- App Router under `src/app` only (no API changes).
- Pages: home, launches, vehicles, capsules, company, cores, crew, roadster.
- TypeScript definitions for supported languages.
- SEO optimization with proper hreflang and canonical URLs.

Approach
1) Introduce a dynamic `[lang]` segment at the app root and nest all pages under it.
2) Read `params.lang` to drive translations and keep Zustand in sync.
3) Redirect bare routes (`/`, `/cores`, etc.) to a default language (e.g., `en`) and optionally detect browser locale.
4) Update all internal links and the language switcher to preserve/replace the `[lang]` segment.
5) Provide rewrites for legacy paths if necessary.

Tasks
0. TypeScript setup
   - Create type definition: `type SupportedLanguage = 'en' | 'es' | 'fr' | 'zh' | 'ja'`
   - Add language validation utilities and error handling for unsupported languages
   - Set up fallback mechanisms for missing translations

1. Create language segment
   - Create `src/app/[lang]/layout.tsx` and move the current `src/app/layout.tsx` logic there.
   - Add language validation in layout with 404 handling for unsupported codes.
   - Create `src/app/[lang]/page.tsx` from the current `src/app/page.tsx`.
   - Move feature routes into `src/app/[lang]/{launches,vehicles,capsules,company,cores,crew,roadster}/page.tsx` and their `layout.tsx`.

2. Wire translations to URL
   - In each page (and in shared layouts/components that call translations), read `params.lang` via the `Page` signature or `useParams()` for Client Components.
     - Server Component: `export default function Page({ params }: { params: { lang: string } }) { ... }`
     - Client Component: `const { lang } = useParams<{ lang: string }>();`
   - Replace `useLanguageStore().currentLanguage` reads with `params.lang` for the source of truth; keep the store in sync: `setLanguage(params.lang)`.
   - Call `getTranslation(params.lang)` instead of using the store value directly.

3. Default language redirect
   - Option A (recommended): Add `src/middleware.ts` to rewrite/redirect to `/${DEFAULT_LANG}${pathname}` when the first segment is not a supported language.
   - Option B: Add `src/app/page.tsx` that immediately redirects to `/en` using `redirect('/en')`.
   - Optionally detect `Accept-Language` in middleware and choose the best match from supported languages.

4. Update navigation and language switcher
   - Ensure all `Link` hrefs include the current language: e.g., ``<Link href={`/${lang}/cores`}>``.
   - Create/Update a LanguageSwitcher that maps to the same path in another language:
     - Read current pathname via `usePathname()`.
     - Replace the first segment with the target code.
     - Navigate with `router.push(newPath)`.

5. SEO and sitemap
   - Update `src/lib/seo.ts` to generate URLs with `/${lang}` prefix.
   - Add `hreflang` attributes to indicate language alternatives.
   - Include `canonical` URLs pointing to the default language version.
   - Add language-specific meta descriptions where applicable.
   - Update `src/app/sitemap.ts` to emit localized URLs for each supported language.

6. Rewrites for legacy paths (optional but helpful)
   - Add to `next.config.ts` rewrites from `/:path*` to `/en/:path*` to keep old links working, or permanent redirects if appropriate.

7. Performance optimization
   - Implement lazy loading of translation files to avoid loading all languages upfront.
   - Consider static generation for supported language combinations.
   - Add monitoring for redirect performance impact.

8. User experience enhancements
   - Add fallback mechanism when a page doesn't exist in a specific language.
   - Consider showing a banner when auto-redirecting users based on browser locale.
   - Add analytics tracking for language usage patterns.

9. QA checklist
   - Verify each page renders under `/${lang}/...` for at least `en` and `fr`.
   - Status filters on `/fr/cores` show localized labels.
   - Last update phrases on `/fr/cores` are translated.
   - Language switcher preserves the rest of the path when switching.
   - Old paths (e.g., `/cores`) redirect to `/en/cores` (or chosen default).
   - Test error handling for unsupported language codes.
   - Verify hreflang and canonical URLs are properly set.
   - Test translation fallbacks for missing keys.

File Changes (high level)
- New: `src/types/language.ts` with `SupportedLanguage` type and validation utilities.
- New: `src/app/[lang]/layout.tsx` (copy of previous root layout; read `params.lang` and pass via context/provider if needed).
- Move: `src/app/page.tsx` -> `src/app/[lang]/page.tsx`.
- Move: `src/app/{launches,vehicles,capsules,company,cores,crew,roadster}` -> `src/app/[lang]/{...}`.
- New (Option A): `src/middleware.ts` for language detection/redirect.
- Update: Components that use translations to consume `lang` from params and sync Zustand.
- Update: All `<Link>`s to include the `/${lang}` prefix.
- Update: `next.config.ts` rewrites/redirects (optional).
- Update: SEO components to include hreflang and canonical URLs.

Pseudocode snippets
```ts
// src/types/language.ts
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'zh' | 'ja';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr', 'zh', 'ja'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

// src/app/[lang]/layout.tsx
import { notFound } from 'next/navigation';
import { isSupportedLanguage } from '@/types/language';

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string }
}) {
  // Validate language parameter
  if (!isSupportedLanguage(params.lang)) {
    notFound();
  }

  // Set store: useLanguageStore.getState().setLanguage(params.lang)
  return (
    <html lang={params.lang}>
      <head>
        {/* Add hreflang and canonical meta tags */}
        <link rel="canonical" href={`https://example.com/en${pathname}`} />
        {SUPPORTED_LANGUAGES.map(lang => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://example.com/${lang}${pathname}`}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}

// src/middleware.ts (Option A)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/types/language';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split('/')[1];

  if (!SUPPORTED_LANGUAGES.includes(first as any)) {
    // Optional: Browser language detection
    const acceptLanguage = req.headers.get('accept-language');
    const detectedLang = detectBestLanguage(acceptLanguage) || DEFAULT_LANGUAGE;

    return NextResponse.redirect(new URL(`/${detectedLang}${pathname}`, req.url));
  }
}

function detectBestLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;

  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
  return languages.find(lang => SUPPORTED_LANGUAGES.includes(lang as any)) || null;
}
```

Migration Order
1) Create TypeScript language definitions and validation utilities.
2) Create `[lang]` layout and duplicate home page under it.
3) Move one route at a time (cores → launches → others), updating imports and `params` usage.
4) Add middleware or root redirect to default language with browser detection.
5) Update navigation and language switcher.
6) Update SEO components with hreflang and canonical URLs.
7) Add performance optimizations (lazy loading, static generation).
8) Add user experience enhancements (fallbacks, banners, analytics).
9) Add rewrites for legacy paths if desired.
10) Comprehensive QA across `en` and `fr` including error scenarios.

Roll-back
- Remove middleware/root redirect and revert pages from `src/app/[lang]/...` back to `src/app/...` if needed. Keep `git` diffs small by moving routes rather than renaming logic.

Testing Strategy
- Add E2E tests for language switching scenarios.
- Include tests for middleware redirect logic and browser language detection.
- Test crawlability of language-prefixed URLs.
- Test error handling for unsupported language codes.
- Test translation fallbacks for missing keys.
- Add integration tests with retry logic and proper timeout handling.

Migration Safety
- Consider implementing a feature flag to gradually roll out the new routing.
- Monitor 404s from old non-prefixed URLs during transition.
- Set up performance monitoring for redirect impact.
- Implement gradual rollout strategy if needed.

Notes
- Keep the Zustand store for persistence, but derive the active language from the URL to avoid mismatches.
- Keep `getTranslation(params.lang)` as the single source of translation data.
- Consider lazy loading of translation files to improve initial page load performance.
- Implement proper error boundaries for translation failures.
- Track language usage analytics to understand user preferences.

