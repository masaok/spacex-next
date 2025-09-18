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
      // Start with lenient thresholds; tighten over time
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.85 }],
        // De-noise PWA/CSP checks for this non-PWA app
        'categories:pwa': 'off',
        'installable-manifest': 'off',
        'maskable-icon': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'warn',
        'service-worker': 'off',
        'is-on-https': 'off',
        'csp-xss': 'off',
        // Performance signal-only; do not fail CI
        'total-byte-weight': 'warn',
        'unused-javascript': 'warn',
        'uses-text-compression': 'warn',
        'bootup-time': 'warn',
        'dom-size': 'warn',
        'mainthread-work-breakdown': 'warn',
        'server-response-time': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
