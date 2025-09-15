'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Report Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              // Report LCP to analytics (replace with your analytics)
              console.log('LCP:', lastEntry.startTime);
              // gtag('event', 'lcp', { value: lastEntry.startTime });
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'first-input') {
                const fidEntry = entry as PerformanceEntry & {
                  processingStart?: number;
                };
                const fid = (fidEntry.processingStart || 0) - entry.startTime;
                console.log('FID:', fid);
                // gtag('event', 'fid', { value: fid });
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const layoutShiftEntry = entry as PerformanceEntry & {
                hadRecentInput?: boolean;
                value?: number;
              };
              if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value || 0;
              }
            });
            console.log('CLS:', clsValue);
            // gtag('event', 'cls', { value: clsValue });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Time to First Byte (TTFB)
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry) {
            const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
            console.log('TTFB:', ttfb);
            // gtag('event', 'ttfb', { value: ttfb });
          }

        } catch (error) {
          console.warn('Performance monitoring not available:', error);
        }
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

// Hook for measuring custom performance metrics
export function usePerformanceMetric(name: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`${name} duration:`, duration);
      // Report to your analytics service
      // gtag('event', 'custom_metric', {
      //   metric_name: name,
      //   value: duration
      // });
    };
  }, [name]);
}