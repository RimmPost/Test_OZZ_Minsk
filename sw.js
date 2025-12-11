const CACHE_NAME = 'ozz-test-v2'; // Обновил версию
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' // Добавил иконку в кэш (обязательно добавь файл в репозиторий)
];

// Установка
self.addEventListener('install', (e) => {
  // Заставляем SW активироваться немедленно
  self.skipWaiting();
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация
self.addEventListener('activate', (e) => {
  // Заставляем SW немедленно взять контроль над всеми вкладками
  e.waitUntil(self.clients.claim());
  
  // Очистка старого кэша при смене версии
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch (Оффлайн режим)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});