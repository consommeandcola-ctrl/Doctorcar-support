// Stale-while-revalidate service worker
// 2026-07-15 v3.9.2: 施設間搬送・ドクターデリバリーを搬送方法の選択対象外に変更
const CACHE_NAME = 'doctorcar-pwa-v3.9.2';
const ASSETS = [
  './',
  './index.html',
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
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin) return;
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // 新しいデータを取得できたらキャッシュを更新する
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // オフライン時は何もしない（キャッシュが使われる）
      });
      
      // キャッシュがあれば即座に返し、なければネットワークリクエストの結果を待つ
      return cachedResponse || fetchPromise;
    })
  );
});
