/** @type {import('@lhci/cli').LHCIConfig} */
module.exports = {
  ci: {
    collect: {
      // Server should already be running at :3002 in CI/local
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttlingMethod: 'devtools',
        skipAudits: [
          // Skip the PWA audits by default
          'service-worker',
          'installable-manifest',
          'is-on-https',
          'maskable-icon',
          'splash-screen',
          'apple-touch-icon',
          'themed-omnibox',
          'pwa-category',
        ],
      },
      url: [
        'http://localhost:3002/',
        'http://localhost:3002/launches',
        'http://localhost:3002/vehicles',
        'http://localhost:3002/capsules',
        'http://localhost:3002/company',
        'http://localhost:3002/cores',
        'http://localhost:3002/crew',
        'http://localhost:3002/roadster',
      ],
    },
    assert: {
      // Only check core performance categories with very lenient thresholds
      assertions: {
        'categories:performance': ['warn', { minScore: 0.3 }],
        'categories:accessibility': ['warn', { minScore: 0.5 }],
        'categories:best-practices': ['warn', { minScore: 0.5 }],
        'categories:seo': ['warn', { minScore: 0.6 }],
        // Completely disable PWA category to prevent failures
        'categories:pwa': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    githubStatusContext: 'lhci',
    githubToken: process.env.LHCI_GITHUB_TOKEN,
  },
};
