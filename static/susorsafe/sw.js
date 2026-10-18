/* SusOrSafe — Django service worker (served at /sw.js) */
const CACHE = 'susorsafe-django-v19';
const ASSETS = [
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
  '/manifest.webmanifest',
  '/static/susorsafe/fonts.css',
  '/static/susorsafe/styles.css',
  '/static/susorsafe/v2.css',
  '/static/susorsafe/support.css',
  '/static/susorsafe/data.js',
  '/static/susorsafe/theme.js',
  '/static/susorsafe/app.js',
  '/static/susorsafe/fonts.css?v=19',
  '/static/susorsafe/styles.css?v=19',
  '/static/susorsafe/v2.css?v=19',
  '/static/susorsafe/support.css?v=19',
  '/static/susorsafe/data.js?v=19',
  '/static/susorsafe/theme.js?v=19',
  '/static/susorsafe/app.js?v=19',
  '/static/susorsafe/fonts/plus-jakarta-sans.woff2',
  '/static/susorsafe/fonts/fredoka.woff2',
  '/static/susorsafe/icons/favicon.png',
  '/static/susorsafe/icons/logo-mark.png',
  '/static/susorsafe/icons/icon-192.png',
  '/static/susorsafe/icons/icon-512.png',
  '/static/susorsafe/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request, { ignoreSearch: true }).then(cached => cached || caches.match('/'))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
        return response;
      });
    })
  );
});
