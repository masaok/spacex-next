import { generateSEOMetadata } from '@/lib/seo';
import { coresPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

export const metadata = generateSEOMetadata(coresPageSEO);

export default function CoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: "Falcon Rocket Cores - Reusable First Stage Database",
          description: "Track SpaceX Falcon rocket cores with flight history, landing attempts, reuse statistics, and current status.",
          url: "/cores"
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}