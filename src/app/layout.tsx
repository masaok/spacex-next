import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { generateSEOMetadata, homePageSEO } from "../lib/seo";
import { HomePageSchema } from "../components/StructuredData";
import { PerformanceMonitor } from "../components/PerformanceMonitor";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GOOGLE_ANALYTICS_ID } from '../config/app.config';

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
export const metadata: Metadata = generateSEOMetadata(homePageSEO);

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
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
        <PerformanceMonitor />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
