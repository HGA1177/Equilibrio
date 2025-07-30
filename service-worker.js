const CACHE_NAME = 'app-contable-cache-v17';

const urlsToCache = [
    '/',
    '/index.html',
    '/pagina_balance.html',
    '/pagina_gastos.html',
    '/pagina_ingresos.html',
    '/style.css',
    '/script.js',
    '/script_balance.js',
    '/script_gastos.js',
    '/script_ingresos.js',
    'https://cdn.tailwindcss.com',
    'Logo 192x192.png',
    'Logo 512x512.png',
    'Capicarga 80x80.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Fallo al precargar archivos en caché:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(networkResponse => {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        console.log('No hay conexión a internet y el recurso no está en caché:', event.request.url);
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
