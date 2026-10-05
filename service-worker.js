/* Network-first migration. Wedding facts must not be served from an old cache. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  const old = ['engagement-invite-v1'];
  await Promise.all(old.map(key => caches.delete(key)));
  await self.clients.claim();
})()));
// Intentionally no fetch interception or wedding-fact cache.
