// Service worker SAMA BUSINESS — scope /sama
const CACHE = "sama-v1";
const SHELL = ["/sama", "/sama/dashboard", "/sama-manifest.webmanifest", "/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.startsWith("sama-")).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Réseau d'abord, repli sur le cache (utile en connexion instable).
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || !url.pathname.startsWith("/sama")) return;
  // Ne jamais mettre en cache les appels d'API / actions.
  if (url.pathname.startsWith("/api")) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && e.request.mode === "navigate") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("/sama/dashboard")))
  );
});
