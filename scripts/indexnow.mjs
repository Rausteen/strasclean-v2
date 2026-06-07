#!/usr/bin/env node
/**
 * IndexNow — notifie Bing / ChatGPT Search (et Yandex) qu'il faut (re)crawler
 * nos pages, sans attendre le crawl naturel. C'est le levier le plus rapide
 * pour la visibilité côté IA, qui s'appuie largement sur l'index Bing.
 *
 * Fonctionnement :
 *   1. On récupère le sitemap LIVE (donc toujours synchro avec ce qui est en
 *      prod, pas besoin d'importer les libs TS).
 *   2. On extrait toutes les <loc>.
 *   3. On POST la liste à l'API IndexNow avec notre clé.
 *
 * La clé est aussi hébergée en clair à la racine du site :
 *   https://strasclean.fr/<KEY>.txt   (fichier public/<KEY>.txt)
 * faute de quoi IndexNow refuse les soumissions.
 *
 * Usage :
 *   node scripts/indexnow.mjs                 # utilise SITE_URL par défaut
 *   SITE_URL=https://strasclean.fr node scripts/indexnow.mjs
 *
 * À lancer après chaque déploiement (manuellement, via un hook post-deploy
 * Dokploy, une GitHub Action, ou un cron).
 */

const KEY = "3cc4a25835cd90834d77abbe3b20d02c";
const SITE_URL = (process.env.SITE_URL || "https://strasclean.fr").replace(
  /\/$/,
  "",
);
const host = new URL(SITE_URL).host;
const ENDPOINT = "https://api.indexnow.org/indexnow";
// IndexNow accepte jusqu'à 10 000 URLs par requête.
const MAX_URLS = 10000;

async function main() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  console.log(`[indexnow] Récupération du sitemap : ${sitemapUrl}`);

  const res = await fetch(sitemapUrl, {
    headers: { "user-agent": "StrasClean-IndexNow/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Sitemap inaccessible (HTTP ${res.status})`);
  }
  const xml = await res.text();

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => u.startsWith(SITE_URL))
    .slice(0, MAX_URLS);

  if (urls.length === 0) {
    throw new Error("Aucune URL trouvée dans le sitemap.");
  }
  console.log(`[indexnow] ${urls.length} URLs à soumettre.`);

  const body = {
    host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList: urls,
  };

  const submit = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // 200 = accepté, 202 = accepté (validation clé en cours). Les deux sont OK.
  if (submit.status === 200 || submit.status === 202) {
    console.log(`[indexnow] ✅ Soumis avec succès (HTTP ${submit.status}).`);
  } else {
    const txt = await submit.text().catch(() => "");
    throw new Error(`Échec soumission IndexNow (HTTP ${submit.status}) ${txt}`);
  }
}

main().catch((err) => {
  console.error(`[indexnow] ❌ ${err.message}`);
  process.exit(1);
});
