const CACHE_NAME = 'ozz-test-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Установка Service Worker и кэширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация и получение данных из кэша (Оффлайн режим)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});