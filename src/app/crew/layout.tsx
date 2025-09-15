import { generateSEOMetadata } from '@/lib/seo';
import { crewPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

export const metadata = generateSEOMetadata(crewPageSEO);

export default function CrewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: "SpaceX Crew Members - Astronaut Database",
          description: "Meet SpaceX crew members who have flown on Dragon missions. Detailed profiles of astronauts, their missions, and space achievements.",
          url: "/crew"
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}