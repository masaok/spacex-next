# Language-Prefixed Routes Plan (App Router)

Goal
- Make the first path segment the language code; e.g., `/fr/cores` instead of `/cores`.
- Keep client-side language switching working and align translations with the URL.

Scope
- App Router under `src/app` only (no API changes).
- Pages: home, launches, vehicles, capsules, company, cores, crew, roadster.

Approach
1) Introduce a dynamic `[lang]` segment at the app root and nest all pages under it.
2) Read `params.lang` to drive translations and keep Zustand in sync.
3) Redirect bare routes (`/`, `/cores`, etc.) to a default language (e.g., `en`) and optionally detect browser locale.
4) Update all internal links and the language switcher to preserve/replace the `[lang]` segment.
5) Provide rewrites for legacy paths if necessary.

Tasks
1. Create language segment
   - Create `src/app/[lang]/layout.tsx` and move the current `src/app/layout.tsx` logic there.
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
   - Update `src/app/sitemap.ts` to emit localized URLs for each supported language.

6. Rewrites for legacy paths (optional but helpful)
   - Add to `next.config.ts` rewrites from `/:path*` to `/en/:path*` to keep old links working, or permanent redirects if appropriate.

7. QA checklist
   - Verify each page renders under `/${lang}/...` for at least `en` and `fr`.
   - Status filters on `/fr/cores` show localized labels.
   - Last update phrases on `/fr/cores` are translated.
   - Language switcher preserves the rest of the path when switching.
   - Old paths (e.g., `/cores`) redirect to `/en/cores` (or chosen default).

File Changes (high level)
- New: `src/app/[lang]/layout.tsx` (copy of previous root layout; read `params.lang` and pass via context/provider if needed).
- Move: `src/app/page.tsx` -> `src/app/[lang]/page.tsx`.
- Move: `src/app/{launches,vehicles,capsules,company,cores,crew,roadster}` -> `src/app/[lang]/{...}`.
- New (Option A): `src/middleware.ts` for language detection/redirect.
- Update: Components that use translations to consume `lang` from params and sync Zustand.
- Update: All `<Link>`s to include the `/${lang}` prefix.
- Update: `next.config.ts` rewrites/redirects (optional).

Pseudocode snippets
```ts
// src/app/[lang]/layout.tsx
export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  // validate params.lang against SUPPORTED_LANGUAGES
  // optionally set store: useLanguageStore.getState().setLanguage(params.lang)
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}

// src/middleware.ts (Option A)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const SUPPORTED = ['en','es','fr','zh','ja'];
const DEFAULT_LANG = 'en';
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split('/')[1];
  if (!SUPPORTED.includes(first)) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANG}${pathname}`, req.url));
  }
}
```

Migration Order
1) Create `[lang]` layout and duplicate home page under it.
2) Move one route at a time (cores → launches → others), updating imports and `params` usage.
3) Add middleware or root redirect to default language.
4) Update navigation and language switcher.
5) Update SEO and sitemap.
6) Add rewrites for legacy paths if desired.
7) QA across `en` and `fr`.

Roll-back
- Remove middleware/root redirect and revert pages from `src/app/[lang]/...` back to `src/app/...` if needed. Keep `git` diffs small by moving routes rather than renaming logic.

Notes
- Keep the Zustand store for persistence, but derive the active language from the URL to avoid mismatches.
- Keep `getTranslation(params.lang)` as the single source of translation data.

