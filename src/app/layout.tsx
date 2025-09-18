import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { generateSEOMetadata, homePageSEO } from "../lib/seo";
import { HomePageSchema } from "../components/StructuredData";
import { PerformanceMonitor } from "../components/PerformanceMonitor";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GOOGLE_ANALYTICS_ID, GOOGLE_ANALYTICS_CONSENT_MODE } from '../config/app.config';

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

// Enhanced SEO metadata for root layout
export const metadata: Metadata = {
  ...generateSEOMetadata(homePageSEO),
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f19' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <HomePageSchema />
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
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
        <PerformanceMonitor />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
