import { Metadata } from 'next';
import { generateSEOMetadata, vehiclesPageSEO } from '../../../lib/seo';
import { SupportedLanguage } from '@/types/language';

export const metadata: Metadata = generateSEOMetadata(vehiclesPageSEO);

export default async function VehiclesLayout({
  children,
  _params,
}: {
  children: React.ReactNode;
  _params: Promise<{ lang: SupportedLanguage }>;
}) {
  await _params; // Consume the promise even though we don't use it
  return <>{children}</>;
}