import { generateSEOMetadata } from '@/lib/seo';
import { companyPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

export const metadata = generateSEOMetadata(companyPageSEO);

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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