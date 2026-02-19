
// File kosong untuk menonaktifkan service worker secara permanen
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
  e.waitUntil(
    caches.keys().then((names) => {
      for (let name of names) caches.delete(name);
    })
  );
});
