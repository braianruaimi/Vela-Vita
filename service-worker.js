const CACHE_NAME = "vela-vita-v1";
const APP_SHELL = [
    "/Vela-Vita/",
    "/Vela-Vita/index.html",
    "/Vela-Vita/css/styles.css",
    "/Vela-Vita/js/app.js",
    "/Vela-Vita/manifest.webmanifest",
    "/Vela-Vita/images/app-icon.svg",
    "/Vela-Vita/images/vela-aromatica.svg",
    "/Vela-Vita/images/vela-decorativa.svg",
    "/Vela-Vita/images/vela-eventos.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                return networkResponse;
            }).catch(() => caches.match("/Vela-Vita/index.html"));
        })
    );
});