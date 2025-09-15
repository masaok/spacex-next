import { APP_NAME } from '../config/app.config';

interface SchemaProps {
  type: 'website' | 'organization' | 'article' | 'product';
  data?: Record<string, unknown>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spacelaunchdb.com';

export function StructuredData({ type, data }: SchemaProps) {
  let schema: Record<string, unknown> = {};

  switch (type) {
    case 'website':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: APP_NAME,
        url: SITE_URL,
        description: 'Comprehensive database of SpaceX launches, rockets, and spacecraft with real-time data and mission history.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: APP_NAME,
          url: SITE_URL,
        },
      };
      break;

    case 'organization':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: APP_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        description: 'Space launch database providing comprehensive information about SpaceX missions, rockets, and spacecraft.',
        sameAs: [
          // Add social media URLs if available
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          url: `${SITE_URL}/contact`,
        },
      };
      break;

    case 'article':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data?.title || 'SpaceX Launch Information',
        description: data?.description || 'Detailed information about SpaceX launches and missions.',
        author: {
          '@type': 'Organization',
          name: APP_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: APP_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.png`,
          },
        },
        datePublished: data?.datePublished || new Date().toISOString(),
        dateModified: data?.dateModified || new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data?.url || SITE_URL,
        },
      };
      break;

    case 'product':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data?.name || 'SpaceX Vehicle',
        description: data?.description || 'SpaceX rocket or spacecraft.',
        manufacturer: {
          '@type': 'Organization',
          name: 'SpaceX',
        },
        category: 'Space Vehicle',
        ...data,
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Specific schema components for different pages
export function HomePageSchema() {
  return (
    <>
      <StructuredData type="website" />
      <StructuredData type="organization" />
    </>
  );
}

export function LaunchSchema({ launch }: { launch: Record<string, unknown> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: launch.name,
    description: launch.details || 'SpaceX launch mission',
    startDate: launch.date_utc,
    location: {
      '@type': 'Place',
      name: (launch.launchpad as { full_name?: string })?.full_name || 'SpaceX Launch Site',
    },
    organizer: {
      '@type': 'Organization',
      name: 'SpaceX',
    },
    eventStatus: launch.success === true ? 'https://schema.org/EventScheduled' :
                launch.success === false ? 'https://schema.org/EventCancelled' :
                'https://schema.org/EventPostponed',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function VehicleSchema({ vehicle }: { vehicle: Record<string, unknown> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.description || `${vehicle.name} is a SpaceX rocket designed for space missions.`,
    manufacturer: {
      '@type': 'Organization',
      name: 'SpaceX',
    },
    category: 'Space Vehicle',
    model: vehicle.name,
    productionDate: vehicle.first_flight,
    weight: vehicle.mass ? {
      '@type': 'QuantitativeValue',
      value: (vehicle.mass as { kg?: number })?.kg,
      unitCode: 'KGM',
    } : undefined,
    height: vehicle.height ? {
      '@type': 'QuantitativeValue',
      value: (vehicle.height as { meters?: number })?.meters,
      unitCode: 'MTR',
    } : undefined,
    width: vehicle.diameter ? {
      '@type': 'QuantitativeValue',
      value: (vehicle.diameter as { meters?: number })?.meters,
      unitCode: 'MTR',
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}