const CACHE_NAME = 'ozz-test-v3'; // Увеличил версию
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon.png' 
  // ВАЖНО: Если у вас есть папка images, не добавляйте её целиком сюда, 
  // Service Worker не умеет сканировать папки. Кэшируйте картинки по мере запроса (см. fetch ниже).
];

// Установка
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Используем addAll, но если какого-то файла нет, SW не установится.
      // Убедитесь, что icon.png существует!
      return cache.addAll(ASSETS);
    })
  );
});

// Активация
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

// Перехват запросов
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Если есть в кэше - отдаем
      if (response) {
        return response;
      }
      // Если нет - качаем из сети
      return fetch(e.request).then((networkResponse) => {
        // (Опционально) Можно добавлять просмотренные картинки в кэш динамически:
        // return caches.open(CACHE_NAME).then((cache) => {
        //   cache.put(e.request, networkResponse.clone());
        //   return networkResponse;
        // });
        return networkResponse;
      });
    })
  );
});