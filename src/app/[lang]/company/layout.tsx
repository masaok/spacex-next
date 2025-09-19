import { generateSEOMetadata } from '@/lib/seo';
import { companyPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { SupportedLanguage } from '@/types/language';

export const metadata = generateSEOMetadata(companyPageSEO);

export default async function CompanyLayout({
  children,
  _params,
}: {
  children: React.ReactNode;
  _params: Promise<{ lang: SupportedLanguage }>;
}) {
  await _params; // Consume the promise even though we don't use it
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