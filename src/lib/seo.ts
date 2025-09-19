import { Metadata } from 'next';
import { APP_NAME } from '../config/app.config';
import { SUPPORTED_LANGUAGES, type SupportedLanguage, DEFAULT_LANGUAGE } from '../types/language';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  lang?: SupportedLanguage;
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
  lang = DEFAULT_LANGUAGE,
  openGraph,
  twitter,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;

  // Generate language-specific URLs
  const basePath = canonical || '/';
  const currentPageUrl = `${SITE_URL}/${lang}${basePath === '/' ? '' : basePath}`;
  const defaultPageUrl = `${SITE_URL}/${DEFAULT_LANGUAGE}${basePath === '/' ? '' : basePath}`;

  // Generate hreflang alternates
  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LANGUAGES.forEach(language => {
    languageAlternates[language] = `${SITE_URL}/${language}${basePath === '/' ? '' : basePath}`;
  });

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),

    // Canonical URL points to default language version
    alternates: {
      canonical: defaultPageUrl,
      languages: languageAlternates,
    },

    // Open Graph
    openGraph: {
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      url: currentPageUrl,
      siteName: DEFAULT_TITLE,
      type: openGraph?.type || 'website',
      locale: lang,
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

export const capsulesPageSEO = {
  title: 'Dragon Capsules - SpaceX Spacecraft Database',
  description: 'Explore SpaceX Dragon capsule fleet with detailed specifications, mission history, and status. Complete database of Crew Dragon and Cargo Dragon capsules.',
  keywords: [
    'Dragon capsules',
    'Crew Dragon',
    'Cargo Dragon',
    'SpaceX spacecraft',
    'capsule specifications',
    'space station missions',
    'reusable spacecraft'
  ],
  canonical: '/capsules',
};

export const companyPageSEO = {
  title: 'SpaceX Company Information - About Space Exploration Technologies',
  description: 'Learn about SpaceX company history, headquarters, valuation, employees, and mission to revolutionize space technology and enable Mars colonization.',
  keywords: [
    'SpaceX company',
    'Elon Musk',
    'space exploration technologies',
    'Mars colonization',
    'rocket development',
    'space industry',
    'aerospace company'
  ],
  canonical: '/company',
};

export const coresPageSEO = {
  title: 'Falcon Rocket Cores - Reusable First Stage Database',
  description: 'Track SpaceX Falcon rocket cores with flight history, landing attempts, reuse statistics, and current status. Complete core database.',
  keywords: [
    'Falcon cores',
    'reusable rockets',
    'first stage',
    'landing statistics',
    'core reuse',
    'rocket recovery',
    'SpaceX boosters'
  ],
  canonical: '/cores',
};

export const crewPageSEO = {
  title: 'SpaceX Crew Members - Astronaut Database',
  description: 'Meet SpaceX crew members who have flown on Dragon missions. Detailed profiles of astronauts, their missions, and space achievements.',
  keywords: [
    'SpaceX crew',
    'astronauts',
    'Dragon crew',
    'space missions',
    'crew members',
    'space explorers',
    'human spaceflight'
  ],
  canonical: '/crew',
};

export const dragonsPageSEO = {
  title: 'Dragon Spacecraft Versions - Capsule Evolution',
  description: 'Explore Dragon spacecraft evolution from Dragon 1 to Crew Dragon. Technical specifications, capabilities, and development history.',
  keywords: [
    'Dragon spacecraft',
    'Dragon evolution',
    'Crew Dragon',
    'Dragon 1',
    'spacecraft development',
    'space capsule technology',
    'human rated spacecraft'
  ],
  canonical: '/dragons',
};

export const landpadsPageSEO = {
  title: 'SpaceX Landing Pads - Recovery Infrastructure',
  description: 'Discover SpaceX landing facilities including drone ships, landing pads, and recovery infrastructure. Detailed information on rocket recovery systems.',
  keywords: [
    'SpaceX landing pads',
    'drone ships',
    'rocket recovery',
    'landing infrastructure',
    'autonomous spaceport',
    'rocket landing',
    'recovery systems'
  ],
  canonical: '/landpads',
};

export const launchpadsPageSEO = {
  title: 'SpaceX Launch Facilities - Launch Pad Database',
  description: 'Complete guide to SpaceX launch facilities at Kennedy Space Center, Vandenberg, and Starbase. Launch pad specifications and capabilities.',
  keywords: [
    'SpaceX launch pads',
    'Kennedy Space Center',
    'Vandenberg',
    'Starbase',
    'launch facilities',
    'rocket launch sites',
    'space infrastructure'
  ],
  canonical: '/launchpads',
};

export const payloadsPageSEO = {
  title: 'SpaceX Mission Payloads - Satellite & Cargo Database',
  description: 'Explore SpaceX mission payloads including satellites, cargo, and space station supplies. Complete payload database with mission details.',
  keywords: [
    'SpaceX payloads',
    'satellite deployment',
    'space cargo',
    'mission payloads',
    'ISS supplies',
    'commercial satellites',
    'space logistics'
  ],
  canonical: '/payloads',
};

export const roadsterPageSEO = {
  title: 'Tesla Roadster in Space - Live Tracking Data',
  description: 'Track Elon Musk\'s Tesla Roadster currently orbiting in space. Live position data, orbital mechanics, and journey through the solar system.',
  keywords: [
    'Tesla Roadster space',
    'Starman',
    'Falcon Heavy test',
    'space car',
    'orbital tracking',
    'solar system journey',
    'space oddity'
  ],
  canonical: '/roadster',
};

export const shipsPageSEO = {
  title: 'SpaceX Fleet - Recovery Ships & Support Vessels',
  description: 'Complete SpaceX maritime fleet including drone ships, recovery vessels, and support ships. Detailed specifications and mission history.',
  keywords: [
    'SpaceX ships',
    'drone ships',
    'recovery fleet',
    'maritime operations',
    'autonomous spaceport',
    'rocket recovery ships',
    'support vessels'
  ],
  canonical: '/ships',
};

export const starlinkPageSEO = {
  title: 'Starlink Satellites - Constellation Database',
  description: 'Track Starlink satellite constellation with live orbital data. Satellite specifications, deployment missions, and network coverage.',
  keywords: [
    'Starlink satellites',
    'satellite constellation',
    'internet satellites',
    'orbital data',
    'space internet',
    'satellite deployment',
    'global connectivity'
  ],
  canonical: '/starlink',
};

export const historyPageSEO = {
  title: 'SpaceX History - Milestones & Achievements',
  description: 'Explore SpaceX historical milestones from first Falcon 1 launch to Mars missions. Complete timeline of space exploration achievements.',
  keywords: [
    'SpaceX history',
    'space milestones',
    'rocket achievements',
    'space exploration timeline',
    'SpaceX firsts',
    'space industry evolution',
    'aerospace milestones'
  ],
  canonical: '/history',
};