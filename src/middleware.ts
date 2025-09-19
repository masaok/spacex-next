import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES, detectBestLanguage, type SupportedLanguage } from '@/types/language';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract the potential language code from the first segment
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // If the first segment is a supported language, continue
  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return NextResponse.next();
  }

  // If no language or unsupported language, redirect to default/detected language
  const acceptLanguage = req.headers.get('accept-language');
  const detectedLang = detectBestLanguage(acceptLanguage);

  // Construct the new URL with the detected/default language
  const newUrl = new URL(`/${detectedLang}${pathname}`, req.url);

  // Use a redirect to ensure the URL in the browser shows the language prefix
  return NextResponse.redirect(newUrl);
}

export const config = {
  // Match all paths except those starting with /api/, /_next/, or containing a dot (static files)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};