import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { notFound } from 'next/navigation';
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { generateSEOMetadata, homePageSEO } from "../../lib/seo";
import { HomePageSchema } from "../../components/StructuredData";
import { PerformanceMonitor } from "../../components/PerformanceMonitor";
import { OptimizedGoogleAnalytics } from "../../components/OptimizedGoogleAnalytics";
import { GOOGLE_ANALYTICS_CONSENT_MODE } from '../../config/app.config';
import { isSupportedLanguage, type SupportedLanguage, DEFAULT_LANGUAGE } from '../../types/language';
import { LanguageProvider } from '../../components/LanguageProvider';
import { HrefLangTags } from '../../components/HrefLangTags';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Enhanced SEO metadata for root layout with language-specific content
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  // Validate language parameter
  if (!isSupportedLanguage(lang)) {
    return generateSEOMetadata({ ...homePageSEO, lang: DEFAULT_LANGUAGE });
  }
  return generateSEOMetadata({ ...homePageSEO, lang });
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f19' },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // Validate language parameter
  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  return (
    <html lang={lang}>
      <head>
        <HomePageSchema />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b0f19" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SpaceX" />
        <link rel="apple-touch-icon" href="/api/icons/192" />

        {/* Add hreflang and canonical meta tags */}
        <HrefLangTags />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}
      >
        {GOOGLE_ANALYTICS_CONSENT_MODE && (
          <Script
            id="consent-manager"
            type="text/javascript"
            data-cmp-ab="1"
            src="https://cdn.consentmanager.net/delivery/autoblocking/6785bc5732160.js"
            data-cmp-host="c.delivery.consentmanager.net"
            data-cmp-cdn="cdn.consentmanager.net"
            data-cmp-codesrc="16"
            strategy="beforeInteractive"
          />
        )}
        <OptimizedGoogleAnalytics />
        <PerformanceMonitor />
        <LanguageProvider lang={lang as SupportedLanguage}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}