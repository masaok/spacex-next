import { generateSEOMetadata } from '@/lib/seo';
import { capsulesPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

export const metadata = generateSEOMetadata(capsulesPageSEO);

export default function CapsulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: "Dragon Capsules - SpaceX Spacecraft Database",
          description: "Explore SpaceX Dragon capsule fleet with detailed specifications, mission history, and status.",
          url: "/capsules"
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}