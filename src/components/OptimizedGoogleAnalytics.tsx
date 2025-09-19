'use client';

import { useEffect } from 'react';
import { GOOGLE_ANALYTICS_ID } from '../config/app.config';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function OptimizedGoogleAnalytics() {
  useEffect(() => {
    // Only load GA after the page has finished loading
    const loadGA = () => {
      if (typeof window !== 'undefined' && GOOGLE_ANALYTICS_ID) {
        // Create script element for gtag
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(script);

        // Initialize gtag function
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
          window.dataLayer.push(args);
        }

        // Configure GA with optimized settings
        gtag('js', new Date());
        gtag('config', GOOGLE_ANALYTICS_ID, {
          // Optimize loading
          send_page_view: false, // We'll send manually when needed
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        });

        // Send page view after initial load
        gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    };

    // Delay loading until after critical resources
    if (document.readyState === 'complete') {
      setTimeout(loadGA, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(loadGA, 1000));
    }
  }, []);

  return null;
}