// Service worker minimal de l'app Équipe : sa seule présence (avec le
// manifest) rend l'app installable sur Android. On ne met PAS de cache
// agressif — l'app a besoin du réseau pour la base de données. On laisse
// donc passer les requêtes telles quelles.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // passthrough réseau (aucune interception)
});
