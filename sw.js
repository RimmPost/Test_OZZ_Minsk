const CACHE_NAME = 'ozz-test-v5'; // Меняйте эту цифру при обновлении вопросов
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Установка Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Активировать немедленно
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Пытаемся закэшировать критические файлы
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Активация и удаление старого кэша
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

// 3. Перехват запросов (Оффлайн режим)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Если файл есть в кэше — отдаем его
      if (response) {
        return response;
      }
      // Если нет — качаем из интернета
      return fetch(e.request).catch(() => {
        // Если интернета нет и файла нет в кэше — ничего не делаем (или можно вернуть заглушку)
      });
    })
  );
});