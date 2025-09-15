import { Metadata } from 'next';
import { generateSEOMetadata, vehiclesPageSEO } from '../../lib/seo';

export const metadata: Metadata = generateSEOMetadata(vehiclesPageSEO);

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}