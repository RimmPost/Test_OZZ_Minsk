const CACHE_NAME = 'ozz-test-v12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './screen-mobile.png',
  './screen-desktop.png'
];

// Установка Service Worker
self.addEventListener('install', (e) => {
  // Заставляет ждать активации немедленно
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Если какого-то файла нет на сервере, установка может сломаться.
      // Мы используем addAll, чтобы закэшировать основные файлы.
      return cache.addAll(ASSETS);
    })
  );
});

// Активация и удаление старого кэша
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Перехват запросов (работа офлайн)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});