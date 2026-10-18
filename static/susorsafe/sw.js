/* SusOrSafe — Production Progressive Web App Service Worker (served at /sw.js) */
'use strict';

const CACHE = 'susorsafe-pwa-v20';

const PRECACHE_ASSETS = [
  '/',
  '/lessons/',
  '/games/',
  '/toolkit/',
  '/parents/',
  '/install/',
  '/about/',
  '/support/',
  '/support/subscribe/',
  '/support/donate/',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/manifest.json',
  '/static/susorsafe/fonts.css',
  '/static/susorsafe/styles.css',
  '/static/susorsafe/v2.css',
  '/static/susorsafe/support.css',
  '/static/susorsafe/data.js',
  '/static/susorsafe/theme.js',
  '/static/susorsafe/app.js',
  '/static/susorsafe/fonts/plus-jakarta-sans.woff2',
  '/static/susorsafe/fonts/fredoka.woff2',
  '/static/susorsafe/icons/favicon.png',
  '/static/susorsafe/icons/favicon.svg',
  '/static/susorsafe/icons/logo-mark.png',
  '/static/susorsafe/icons/icon-192.png',
  '/static/susorsafe/icons/icon-512.png',
  '/static/susorsafe/icons/maskable-512.png',
  '/static/susorsafe/icons/apple-touch-icon.png'
];

// Install: Pre-cache assets with resilient Promise.allSettled
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          fetch(url, { credentials: 'same-origin' })
            .then(response => {
              if (response.ok) return cache.put(url, response);
              return null;
            })
            .catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up previous caches & claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for navigations with offline fallback; Cache-first for assets
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreSearch: true });
          if (cached) return cached;
          return (await caches.match('/', { ignoreSearch: true })) || (await caches.match('/install/'));
        })
    );
    return;
  }

  // Static Assets: Cache-first with background network revalidation
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => null);

      return cached || fetchPromise;
    })
  );
});
