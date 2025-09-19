import { Metadata } from 'next';
import { generateSEOMetadata, launchesPageSEO } from '../../../lib/seo';
import { SupportedLanguage } from '@/types/language';

export const metadata: Metadata = generateSEOMetadata(launchesPageSEO);

export default async function LaunchesLayout({
  children,
  _params,
}: {
  children: React.ReactNode;
  _params: Promise<{ lang: SupportedLanguage }>;
}) {
  await _params; // Consume the promise even though we don't use it
  return <>{children}</>;
}