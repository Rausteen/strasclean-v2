# StrasClean — Landing page

Site web local ultra-convertissant pour StrasClean, service de nettoyage auto à
domicile à Strasbourg et alentours.

**Stack** : Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS.
**Pages générées** : 1 home + `/formules` + 12 pages ville + 60 pages
service × ville = ~74 pages statiques (HTML pré-rendu au build).

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm run start    # lance le build (port 3000)
```

## Mise en ligne (production)

### Option A — Vercel (recommandé, gratuit, zéro config)

1. Importer le repo sur https://vercel.com
2. Vercel détecte Next.js → "Deploy"
3. Ajouter le domaine `strasclean.fr` dans Settings → Domains (HTTPS auto)
4. Mettre les variables d'environnement (voir plus bas) dans Settings → Environment Variables
5. Chaque `git push` redéploie automatiquement

### Option B — VPS / serveur SSH (OVH, Hetzner, etc.)

```bash
ssh root@<ip>
git clone <repo> && cd strasclean-v2
npm install
npm run build
# servir avec pm2 :
npm i -g pm2
pm2 start "npm run start" --name strasclean
pm2 save && pm2 startup
```

Pour mettre à jour : `git pull && npm run build && pm2 restart strasclean`.

⚠️ **Important après mise en ligne** : mettre la vraie URL dans `lib/site.ts`
(`url: "https://strasclean.fr"`) — c'est utilisé par le sitemap, l'Open Graph
et le JSON-LD.

## Variables d'environnement (analytics / pub)

Copier `.env.example` → `.env.local` (dev) ou les configurer chez l'hébergeur.
**Tout est optionnel** — laisser vide = bloc non chargé.

| Variable | Exemple | Rôle |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXX` | Google Analytics 4 |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-17962141009` | Google Ads (charge gtag) |
| `NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL` | `AW-17962141009/axtcCP3o0qwcENGKgvVC` | Conversion "Contact" sur clic WhatsApp |
| `NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL` | `AW-17962141009/xxxxxxxx` | Conversion "Phone call lead" sur clic téléphone |
| `NEXT_PUBLIC_META_PIXEL_ID` | `123456789012` | Meta / Facebook Pixel |
| `ADMIN_PASSWORD` | `mot-de-passe-fort` | Mot de passe du dashboard `/admin` (côté serveur, non exposé) |
| `SESSION_SECRET` | `32+ caractères aléatoires` | Secret HMAC pour signer la session admin |

## Dashboard admin (`/admin`)

Tracking server-side natif (indépendant de GA/Google Ads) qui enregistre
chaque visite + chaque clic WhatsApp/téléphone dans une base SQLite locale
(`data/analytics.db`).

**Accès** : `https://strasclean.fr/admin` → mot de passe (variable `ADMIN_PASSWORD`).
Session persistante 1 an, non listée dans le sitemap, `noindex,nofollow`.

**Données capturées par visite** : timestamp, IP (X-Forwarded-For ok), User-Agent,
device/OS/browser, referer, path, querystring complet, UTM (source/medium/campaign/
content/term), `gclid`, `fbclid`, et **source classifiée** automatiquement parmi
`ads` / `organic` / `direct` / `referral` / `social`.

**Données capturées par clic** : timestamp, type (`whatsapp_click` / `phone_click`),
page d'où provient le clic, href cible, IP, User-Agent, session ID (localStorage).

**Mise en place sur ton VPS** :

```bash
ssh root@<ip>
cd ~/strasclean-v2
nano .env.local
# Ajouter :
#   ADMIN_PASSWORD=monPasswordFort
#   SESSION_SECRET=$(openssl rand -hex 32)   # ou n'importe quelle chaîne 32+ chars
npm install         # compile better-sqlite3 pour Linux
mkdir -p data       # la base sera créée automatiquement au premier appel
npm run build
pm2 restart strasclean
```

⚠️ **RGPD** : IP + UA sont des données personnelles. Mentionne-les dans ta politique
de confidentialité, et purge les données plus anciennes que 13 mois (cron à mettre
en place : `DELETE FROM visits WHERE ts < <cutoff>;`).

Chaque clic WhatsApp / téléphone déclenche automatiquement :
- un événement GA4 (`whatsapp_click` / `phone_click` avec value 56 EUR)
- une conversion Google Ads (si le label correspondant est défini)
- un événement Meta Pixel `Lead` (si le pixel est configuré)

Voir `components/Analytics.tsx` pour les détails.

## Contenu à personnaliser

| Quoi | Où |
|---|---|
| Numéro de téléphone, WhatsApp, email, zones | `lib/site.ts` |
| Formules (Confort / Premium / Luxury) — noms, prix, contenu | `lib/plans.ts` |
| Prestations (shampouinage, detailing…) — slugs, prix, FAQ | `lib/services.ts` |
| Villes desservies — codes postaux, quartiers, intro, avis | `lib/cities.ts` |
| FAQ générale | `lib/faq.ts` |
| Avis clients | `components/Testimonials.tsx` (constante `REVIEWS`) |
| SEO global (title, description, OG, JSON-LD) | `app/layout.tsx` |
| Hero / titres | `components/Hero.tsx`, `components/FinalCTA.tsx` |

## Images

| Image | Chemin attendu | Format |
|---|---|---|
| Hero | `public/hero.webp` | WebP, ~1600×1200, < 200 Ko |
| Avant/Après sièges | `public/avant-apres/siegeavant.webp` / `siegeapres.webp` | WebP 4:3, < 200 Ko |
| Avant/Après tapis | `public/avant-apres/tapisavant.webp` / `tapisapres.webp` | idem |
| Avant/Après tableau de bord | `public/avant-apres/tableauavant.webp` / `tableauapres.webp` | idem |
| Avant/Après carrosserie | `public/avant-apres/carrosserieavant.webp` / `carrosserieapres.webp` | idem |
| Open Graph | `public/og.svg` (ou `og.jpg` 1200×630) | — |
| Favicon | `public/favicon.svg` | — |

Tant que `public/avant-apres/*.webp` n'existe pas, la section Avant/Après affiche
des placeholders gradient. Dès que les fichiers sont là, elle bascule
automatiquement (composant `components/BeforeAfter.tsx`). Compresser via
https://squoosh.app (WebP, qualité 80).

## SEO / référencement local — checklist mise en ligne

- [ ] Site déployé avec domaine + HTTPS ; `lib/site.ts` → vraie URL
- [ ] Google Search Console : propriété "Domaine" vérifiée (TXT DNS)
- [ ] Sitemap `sitemap.xml` soumis dans Search Console
- [ ] Inspection d'URL → demander l'indexation de la home, `/formules`, et des
      pages ville prioritaires (Strasbourg, Schiltigheim, Illkirch)
- [ ] Google Business Profile créé (catégorie "Service de nettoyage automobile",
      zone d'intervention = les 12 communes), vérifié
- [ ] Premiers avis Google demandés aux clients (lien direct par WhatsApp)
- [ ] Fiches annuaires : Pages Jaunes, Yelp, Mappy, annuaire CCI Alsace
- [ ] Rich Results Test (`search.google.com/test/rich-results`) → vérifier
      `AutoDetailing`, `FAQPage`, `Service`, `BreadcrumbList`

### Données structurées (JSON-LD) en place

- `AutoDetailing` / `LocalBusiness` sur la home et chaque page ville (scopé ville)
- `Service` + `Offer` sur chaque page service × ville
- `FAQPage` sur toutes les pages avec FAQ (questions service incluses sur les
  pages service × ville)
- `BreadcrumbList` sur les pages ville et service × ville
- `ItemList` sur `/formules`

## Performance / production

- Headers de sécurité (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS) → `next.config.js`
- Cache long (1 an, immutable) sur `/avant-apres/*` et `/hero.webp`
- Images via `next/image` (AVIF/WebP, `sizes` responsive, `priority` sur le hero,
  `loading="lazy"` ailleurs)
- `prefetch={false}` sur les grandes grilles de liens internes (villes,
  prestations) pour éviter le préchargement massif au scroll
- `manifest.webmanifest` généré (`app/manifest.ts`)
- `poweredByHeader: false`, pas de source maps en prod

## Structure

```
app/
  layout.tsx              # SEO global, fonts, JSON-LD, <Analytics/>
  page.tsx                # Home
  [slug]/page.tsx         # Pages ville + service × ville (route dynamique)
  formules/page.tsx       # Hub des 3 formules + villes
  manifest.ts             # Web App Manifest
  sitemap.ts              # Sitemap (home + /formules + villes + service×ville)
  globals.css             # Tailwind + composants utilitaires (.btn, .card…)
components/
  Header / Hero / TrustBar / ProblemsSolution / PricingSection / BeforeAfter
  HowItWorks / Benefits / ServiceArea / Testimonials / MidCTA / FAQ / FinalCTA
  Footer / FloatingWhatsApp / Reveal / Icon
  CityHero / LocalSection / OtherCities          # pages ville
  ServiceCityHero / ServiceDetail / ServiceLinks # pages service × ville
  Analytics.tsx                                  # GA4 / Ads / Pixel + conv. tracking
lib/
  site.ts      # ⚙️ contact, zones
  plans.ts     # formules
  services.ts  # prestations + routeur de slug
  cities.ts    # villes
  faq.ts       # FAQ + helper FAQPage JSON-LD
public/
  favicon.svg · og.svg · robots.txt
  hero.webp · avant-apres/*.webp   # à fournir
```

## Prochaines améliorations possibles

- Slider Avant/Après interactif (drag handle)
- Module avis Google embarqué + `aggregateRating` dans le JSON-LD
- Pages `/mentions-legales` et `/politique-de-confidentialite`
- Pages "service × ville" supplémentaires (ex : décontamination carrosserie)
- Variantes A/B sur le H1 du hero / des pages ville (Quality Score Ads)
- Multi-langue FR/DE (clientèle frontalière)
