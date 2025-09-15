import { Metadata } from 'next';
import { generateSEOMetadata, launchesPageSEO } from '../../lib/seo';

export const metadata: Metadata = generateSEOMetadata(launchesPageSEO);

export default function LaunchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}