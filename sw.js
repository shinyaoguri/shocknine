var CACHE_NAME = "shocknine-cache-v0-01";

var urlsToCache = [
    '/'
];

self.addEventListener('install', event => {
    console.log('Service Worker Installing');
    event.waitUntil(
        caches.open(CACHE_NAME).then(caches => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch.register('sw.js')
        })
    );
});