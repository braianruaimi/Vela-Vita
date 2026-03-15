const CACHE_NAME = "vela-vita-v6";
const APP_SHELL = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./js/app.js",
    "./js/firebase-config.js",
    "./manifest.webmanifest",
    "./images/app-icon.svg",
    "./images/beige.jpeg",
    "./images/Gemini_Generated_Image_og3c3aog3c3aog3c.png",
    "./images/ramo%20lila.jpeg",
    "./images/Ramo%20rojo.jpeg",
    "./images/Ramo%20rosa.jpeg",
    "./images/WhatsApp%20Image%202026-03-14%20at%2018.15.07.jpeg",
    "./images/imag%20productos/florcis.jpeg",
    "./images/imag%20productos/florcitas.jpeg",
    "./images/imag%20productos/florrr.jpeg",
    "./images/imag%20productos/lil.jpeg",
    "./images/imag%20productos/vaso%20flor%20.jpeg",
    "./images/imag%20productos/vel%20don.jpeg",
    "./images/imag%20productos/vel%20frut.jpeg",
    "./images/imag%20productos/vel%20nan.jpeg",
    "./images/imag%20productos/vel%20pos.jpeg",
    "./images/imag%20productos/vela%20postre.jpeg",
    "./images/imag%20productos/vell.jpeg"
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
            }).catch(() => caches.match("./index.html"));
        })
    );
});