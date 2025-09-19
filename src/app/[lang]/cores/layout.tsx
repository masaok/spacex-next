import { generateSEOMetadata } from '@/lib/seo';
import { coresPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { type SupportedLanguage } from '@/types/language';

interface CoresLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLanguage }>;
}

export const metadata = generateSEOMetadata(coresPageSEO);

export default async function CoresLayout({ children, params }: CoresLayoutProps) {
  const { lang } = await params;
  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: "Falcon Rocket Cores - Reusable First Stage Database",
          description: "Track SpaceX Falcon rocket cores with flight history, landing attempts, reuse statistics, and current status.",
          url: `/${lang}/cores`
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}