const CACHE_NAME = 'stride-v1';
const ASSETS = [
  '/task-manager/app.html',
  '/task-manager/manifest.json',
  '/task-manager/icons/icon.svg',
  '/task-manager/icons/apple-touch-icon.svg',
];

// インストール: アセットをキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ: キャッシュ優先、なければネットワーク
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // app.html は常に最新をキャッシュに更新
        if (e.request.url.includes('app.html')) {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, response.clone()));
        }
        return response;
      }).catch(() => caches.match('/task-manager/app.html'));
    })
  );
});
