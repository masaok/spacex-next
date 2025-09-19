import { generateSEOMetadata } from '@/lib/seo';
import { roadsterPageSEO } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

export const metadata = generateSEOMetadata(roadsterPageSEO);

export default async function RoadsterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <StructuredData
        type="article"
        data={{
          title: "Tesla Roadster in Space - Live Tracking Data",
          description: "Track Elon Musk's Tesla Roadster currently orbiting in space. Live position data, orbital mechanics, and journey through the solar system.",
          url: `/${lang}/roadster`
        }}
      />
      <PerformanceMonitor />
      {children}
    </>
  );
}