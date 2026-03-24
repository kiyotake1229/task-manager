const CACHE_NAME = 'stride-v2';
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

// フェッチ: app.html はネットワーク優先（最新を取得）、失敗時のみキャッシュ
self.addEventListener('fetch', e => {
  const isHtml = e.request.url.includes('app.html');

  if (isHtml) {
    // ネットワーク優先: 常に最新を取得し、キャッシュも更新
    e.respondWith(
      fetch(e.request).then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, response.clone()));
        return response;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // その他（アイコン等）はキャッシュ優先
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
