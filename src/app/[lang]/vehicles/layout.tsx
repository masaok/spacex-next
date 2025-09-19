import { Metadata } from 'next';
import { generateSEOMetadata, vehiclesPageSEO } from '../../../lib/seo';

export const metadata: Metadata = generateSEOMetadata(vehiclesPageSEO);

export default async function VehiclesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  await params; // Consume the promise even though we don't use it
  return <>{children}</>;
}