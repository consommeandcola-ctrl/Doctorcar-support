                                        
                                     
                                        
                                        
                                       
                                         
const CACHE_PREFIX = 'doctorcar-pwa-';
const CACHE_NAME = 'doctorcar-pwa-v3.10.5';
const ASSETS = [
  './',
  './index.html',
  './StrokeNotify_v1.0.html',
  './related-apps.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin) return;
  
  event.respondWith(
    caches.match(event.request, {ignoreSearch: event.request.mode === 'navigate'}).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
                                  
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
                                   
      });
      
                                             
      return cachedResponse || fetchPromise;
    })
  );
});
