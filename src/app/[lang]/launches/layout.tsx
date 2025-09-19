import { Metadata } from 'next';
import { generateSEOMetadata, launchesPageSEO } from '../../../lib/seo';

export const metadata: Metadata = generateSEOMetadata(launchesPageSEO);

export default async function LaunchesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  await params; // Consume the promise even though we don't use it
  return <>{children}</>;
}