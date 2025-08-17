// src/core/perf-monitor.js
export function initPerfMonitor() {
  try {
    // LCP
    const obs = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1];
      console.log('[PERF] LCP', { time: Math.round(last.startTime), entry: last });
    });
    obs.observe({ type: 'largest-contentful-paint', buffered: true });

    // Navigation timing
    window.addEventListener('load', () => {
      const [nav] = performance.getEntriesByType('navigation');
      if (nav) {
        console.log('[PERF] nav', {
          ttfb: Math.round(nav.responseStart),
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
          load: Math.round(nav.loadEventEnd),
        });
      }
    });
  } catch (e) {}
}

// لفّافات لقياس Firestore
export async function timed(label, fn) {
  const t0 = performance.now();
  try {
    const res = await fn();
    console.log(`[PERF] ${label}`, Math.round(performance.now() - t0), 'ms');
    return res;
  } catch (e) {
    console.log(`[PERF] ${label} ERROR`, Math.round(performance.now() - t0), 'ms', e);
    throw e;
  }
}
