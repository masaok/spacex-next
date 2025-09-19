import { generateSEOMetadata } from '@/lib/seo';
import { crewPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { SupportedLanguage } from '@/types/language';

export const metadata = generateSEOMetadata(crewPageSEO);

export default async function CrewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: "SpaceX Crew Members - Astronaut Database",
          description: "Meet SpaceX crew members who have flown on Dragon missions. Detailed profiles of astronauts, their missions, and space achievements.",
          url: `/${lang}/crew`
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}