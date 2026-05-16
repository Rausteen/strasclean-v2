#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Indexing API runner — pousse toutes les URLs du sitemap vers Google
 * pour forcer/accélérer leur indexation (24-48h au lieu de 2-6 semaines).
 *
 * Prérequis (à faire une seule fois sur Google Cloud Console) :
 *
 *  1) Activer l'API "Web Search Indexing API" sur ton projet :
 *     https://console.cloud.google.com/apis/library/indexing.googleapis.com
 *
 *  2) Créer un compte de service ("Service Account") :
 *     IAM & Admin > Service Accounts > + CREATE SERVICE ACCOUNT
 *     - Nom : "indexing-bot"
 *     - Rôle : aucun (pas besoin pour cette API)
 *     - Crée-le
 *
 *  3) Générer une clé JSON pour ce compte :
 *     Sur la fiche du Service Account > onglet KEYS > ADD KEY > JSON
 *     Un fichier .json se télécharge → renomme-le `service-account.json`
 *     Note l'email du SA, type : `indexing-bot@<projet>.iam.gserviceaccount.com`
 *
 *  4) Donner les droits dans Google Search Console :
 *     search.google.com/search-console > propriété strasclean.fr
 *     Paramètres > Utilisateurs et autorisations > AJOUTER UN UTILISATEUR
 *     Email = l'email du SA — Permission = "Propriétaire" (obligatoire)
 *
 *  5) Sur ton VPS, place le fichier JSON :
 *     scp service-account.json root@194.135.89.94:~/strasclean-v2/
 *     (sera dans le .gitignore — il ne va pas dans git)
 *
 * Usage (depuis ~/strasclean-v2/) :
 *     node scripts/index-urls.mjs
 *
 *   Options via variables d'env :
 *     GOOGLE_SERVICE_ACCOUNT_JSON=./service-account.json   (chemin, défaut ↑)
 *     SITEMAP_URL=https://strasclean.fr/sitemap.xml         (défaut ↑)
 *     URL_TYPE=URL_UPDATED                                  (ou URL_DELETED)
 *     ONLY_PATH=/nettoyage-voiture-domicile-strasbourg      (ping 1 seule URL)
 *
 * Quota Google : 200 requêtes / jour par défaut. Avec 78 URLs c'est large.
 */

import { readFileSync } from "node:fs";
import crypto from "node:crypto";

const SA_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "./service-account.json";
const SITEMAP_URL = process.env.SITEMAP_URL || "https://strasclean.fr/sitemap.xml";
const URL_TYPE = process.env.URL_TYPE || "URL_UPDATED";
const ONLY_PATH = process.env.ONLY_PATH || ""; // ex: "/formules" → ping juste cette URL
const THROTTLE_MS = Number(process.env.THROTTLE_MS || 400);

const RED = "\x1b[31m", GREEN = "\x1b[32m", DIM = "\x1b[2m", RESET = "\x1b[0m";

function b64url(input) {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(sa) {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const payload = b64url(JSON.stringify(claims));
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  signer.end();
  const signature = b64url(signer.sign(sa.private_key));
  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`OAuth error : ${res.status} — ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function fetchSitemap(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  // Extrait les <loc>…</loc> (suffit pour le sitemap Next.js standard)
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function pingUrl(url, token) {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, type: URL_TYPE }),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  console.log(`${DIM}→ Lecture du service account : ${SA_PATH}${RESET}`);
  let sa;
  try {
    sa = JSON.parse(readFileSync(SA_PATH, "utf8"));
  } catch (e) {
    console.error(`${RED}Impossible de lire ${SA_PATH}.${RESET} Vérifie le chemin.`);
    process.exit(1);
  }
  if (!sa.client_email || !sa.private_key) {
    console.error(`${RED}Fichier invalide : il manque client_email ou private_key.${RESET}`);
    process.exit(1);
  }

  console.log(`${DIM}→ Récupération du token OAuth…${RESET}`);
  const token = await getAccessToken(sa);

  let urls;
  if (ONLY_PATH) {
    const base = SITEMAP_URL.replace(/\/sitemap\.xml$/, "");
    urls = [base + ONLY_PATH];
    console.log(`${DIM}→ Mode ciblé : 1 URL${RESET}`);
  } else {
    console.log(`${DIM}→ Fetch du sitemap ${SITEMAP_URL}${RESET}`);
    urls = await fetchSitemap(SITEMAP_URL);
  }

  console.log(`${DIM}→ ${urls.length} URL(s) à pinguer (type=${URL_TYPE}, délai ${THROTTLE_MS}ms entre chaque)${RESET}\n`);

  let ok = 0, fail = 0;
  for (const url of urls) {
    const { status, body } = await pingUrl(url, token);
    if (status === 200) {
      ok++;
      console.log(`${GREEN}✓${RESET} ${url}`);
    } else {
      fail++;
      let msg = body;
      try {
        const j = JSON.parse(body);
        msg = j.error?.message || body;
      } catch {}
      console.log(`${RED}✗${RESET} ${url}\n  ${DIM}${status} — ${msg.slice(0, 200)}${RESET}`);
    }
    if (THROTTLE_MS > 0) await new Promise((r) => setTimeout(r, THROTTLE_MS));
  }

  console.log(`\n${GREEN}Terminé.${RESET} ${ok} succès, ${fail} échecs sur ${urls.length} URLs.`);
  if (fail > 0) {
    console.log(`${DIM}Erreurs courantes :`);
    console.log(`  - 403 : le SA n'est pas "Propriétaire" sur Search Console`);
    console.log(`  - 404 : l'URL n'existe pas ou renvoie un 4xx`);
    console.log(`  - 429 : quota atteint (200/jour par défaut)${RESET}`);
  }
}

main().catch((err) => {
  console.error(`${RED}Erreur fatale :${RESET}`, err.message || err);
  process.exit(1);
});
