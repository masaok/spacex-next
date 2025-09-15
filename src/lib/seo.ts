import { Metadata } from 'next';
import { APP_NAME } from '../config/app.config';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    image?: string;
  };
}

const DEFAULT_TITLE = APP_NAME;
const DEFAULT_DESCRIPTION = 'Explore SpaceX launches, rockets, and spacecraft. Get real-time data on Falcon 9, Starship missions, launch schedules, and space exploration history.';
const DEFAULT_KEYWORDS = [
  'SpaceX',
  'space launches',
  'rockets',
  'Falcon 9',
  'Starship',
  'space exploration',
  'NASA',
  'satellites',
  'space missions',
  'Elon Musk',
  'space technology',
  'launch schedule'
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://spacelaunchdb.com';

export function generateSEOMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  openGraph,
  twitter,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const pageUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),

    // Canonical URL
    alternates: {
      canonical: pageUrl,
    },

    // Open Graph
    openGraph: {
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      url: pageUrl,
      siteName: DEFAULT_TITLE,
      type: openGraph?.type || 'website',
      images: openGraph?.image ? [
        {
          url: openGraph.image,
          width: 1200,
          height: 630,
          alt: openGraph?.title || fullTitle,
        }
      ] : [
        {
          url: `${SITE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: DEFAULT_TITLE,
        }
      ],
    },

    // Twitter Card
    twitter: {
      card: twitter?.card || 'summary_large_image',
      title: twitter?.title || fullTitle,
      description: twitter?.description || description,
      images: twitter?.image || `${SITE_URL}/images/twitter-image.jpg`,
    },

    // Additional SEO tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification tags (add your verification codes)
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },

    // Author and publisher
    authors: [{ name: DEFAULT_TITLE }],
    publisher: DEFAULT_TITLE,

    // App-specific metadata
    applicationName: DEFAULT_TITLE,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: DEFAULT_TITLE,
    },

    // Formatting
    formatDetection: {
      telephone: false,
    },
  };
}

// Page-specific SEO configurations
export const homePageSEO = {
  title: 'Space Launch Database',
  description: 'Explore SpaceX launches, rockets, and spacecraft with real-time data. Track Falcon 9, Starship missions, launch schedules, and space exploration history.',
  keywords: [
    'SpaceX launches',
    'space launch database',
    'rocket launches',
    'Falcon 9 launches',
    'Starship missions',
    'space exploration data',
    'launch tracking',
    'space news',
    'NASA missions',
    'satellite launches'
  ],
  canonical: '/',
};

export const launchesPageSEO = {
  title: 'SpaceX Launches - Complete Mission History',
  description: 'Browse complete SpaceX launch history from Falcon 1 to Starship. View mission details, success rates, launch dates, and payload information.',
  keywords: [
    'SpaceX launch history',
    'Falcon 9 missions',
    'Starship launches',
    'rocket launch database',
    'space mission archive',
    'launch success rates',
    'SpaceX statistics',
    'satellite deployments'
  ],
  canonical: '/launches',
};

export const vehiclesPageSEO = {
  title: 'SpaceX Vehicles - Rockets & Spacecraft Fleet',
  description: 'Discover SpaceX rocket fleet including Falcon 9, Falcon Heavy, and Starship. View detailed specifications, capabilities, and mission history.',
  keywords: [
    'SpaceX rockets',
    'Falcon 9 specifications',
    'Starship details',
    'Falcon Heavy',
    'rocket specifications',
    'spacecraft fleet',
    'space vehicle database',
    'rocket capabilities'
  ],
  canonical: '/vehicles',
};