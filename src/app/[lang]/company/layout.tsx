import { generateSEOMetadata } from '@/lib/seo';
import { companyPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

export const metadata = generateSEOMetadata(companyPageSEO);

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  await params; // Consume the promise even though we don't use it
  return (
    <>
      <StructuredData
        type="organization"
        data={{
          name: "SpaceX",
          description: "Space Exploration Technologies Corp., trading as SpaceX, is a private American aerospace manufacturer and space transportation services company."
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}