// Service worker: l'app funziona anche offline in palestra.
const CACHE = "diario-palestra-v1";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.pathname.startsWith("/api/")) return;
  // Rete prima, cache come riserva: così vedi sempre l'ultima versione quando sei online.
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && (url.origin === location.origin || url.host.includes("fonts.g"))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || (req.mode === "navigate" ? caches.match("/index.html") : undefined)))
  );
});
