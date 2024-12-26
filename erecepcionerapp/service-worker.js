const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/components/MainPage/MainPage.css',
    '/src/components/ProblemPage/ProblemPage.css',
    '/src/components/Login/Login.css',
    '/assets/slike/logo.png',
    '/assets/slike/restoran.jpg',
    '/assets/slike/usluge.jpg',
    '/assets/slike/problem.jpg', // Proverite da li je ova putanja ispravna
    '/src/main.jsx',
    '/src/components/MainPage/MainPage.jsx',
    '/src/components/ProblemPage/ProblemPage.jsx',
    '/src/components/Login/Login.jsx'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
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
                return fetch(event.request);
            })
    );
});

// Dodajemo event listener za aktivaciju kako bismo odmah učitali sve resurse
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});
