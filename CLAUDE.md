# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Local-SEO landing site for **StrasClean**, a mobile car/home cleaning service around Strasbourg. The whole point of the codebase is to mass-generate hundreds of statically-rendered, keyword-targeted pages (service × city combinations) from a handful of data files, plus a self-hosted analytics/lead-capture backend. Content and UI are in **French** — match that when writing copy, comments, and commit messages.

## Commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build (pre-renders all pages)
npm run start    # serve the production build
npm run lint     # next lint (ESLint)
npm run indexnow # ping IndexNow (Bing/ChatGPT Search) with the live sitemap URLs
```

There is **no test suite** and no test runner configured. "Verifying" a change means `npm run build` succeeding (it pre-renders every page, so a bad data file or slug collision fails the build) and/or `next lint`. Node ≥ 20 is required (`better-sqlite3` is a native module compiled at install).

## Architecture

### Two verticals, one codebase: "Auto" and "Maison"
The site serves two business lines that share components but render distinct layouts and themes:
- **Auto** (green theme) — car cleaning. Home at `/`.
- **Maison** (amber theme) — upholstery/sofa/mattress cleaning. Hub at `/strasclean-maison`.

Section is derived from the URL by `lib/section.ts` → `isMaisonPathname(pathname)`, which `Header`/`Footer`/`FloatingWhatsApp` use to switch theme and nav. **When you add a new Maison slug category, you must add its prefix to `MAISON_SLUG_PREFIXES` in `lib/section.ts`** or the chrome will render with the wrong (Auto) theme.

### Data-driven page generation — `app/[slug]/page.tsx`
A single dynamic route generates the bulk of the site. Two functions govern it:
- `generateStaticParams()` enumerates every page to pre-render: cities + Strasbourg quartiers, every `service × location`, use-case pages, Maison services, Maison SEO pages, and Maison service × city combos.
- `matchSlug(slug)` in `lib/services.ts` is the **router**: it takes a URL slug and returns a discriminated `SlugMatch` union (`city` | `service-city` | `usecase` | `home-service` | `home-service-city`) or `null` → `notFound()`. Order matters — it checks city-page prefix, then service×city, then use-case, then Maison service/SEO/city. The `Page` component switches on `m.type` to render the matching layout (`CityPage`, `ServiceCityPage`, `HomeServicePage`, `UseCasePage`).

`dynamicParams = true` so unknown URLs (bots, old links) render on-demand → `matchSlug` returns null → real 404, instead of crashing the self-hosted runtime. Pages `revalidate` every 6h.

**To add pages, edit the data files — you rarely touch the route.** Each is a typed array; duplicate an entry and fill every field:
- `lib/services.ts` — Auto services (drives `/{service-slug}-{city-slug}`)
- `lib/cities.ts` — communes; `lib/quartiers.ts` — Strasbourg neighborhoods (same templates, different intro text to avoid duplicate-content cannibalization)
- `lib/usecases.ts` — Auto pain-point/use-case pages (unique full slugs)
- `lib/homeServices.ts` / `lib/homeSeoPages.ts` — Maison services & SEO pages
- `lib/site.ts` — contact info, zones, opening hours, socials. **`SITE.url` is consumed by the sitemap, Open Graph, and JSON-LD** — it must be the real production URL.
- `lib/plans.ts`, `lib/faq.ts`, `lib/reviews.ts`

`servicePath()`, `cityPath()`, `useCasePath()`, etc. are the canonical path builders — use them, never hand-build URLs.

### SEO is the product
Every page carries hand-built JSON-LD (`LocalBusiness`/`AutoDetailing`, `Service`+`Offer`, `FAQPage`, `BreadcrumbList`, `ItemList`) constructed inline in the page/component, plus per-page `generateMetadata` (canonical, OG, Twitter, keywords). `app/sitemap.ts` and `app/robots.ts` are generated. When adding a page type, wire it into the sitemap and give it JSON-LD + metadata, matching the patterns already in `app/[slug]/page.tsx`.

### Analytics + leads backend (SQLite, self-hosted)
Independent of GA/Google Ads. `lib/db.ts` is a singleton `better-sqlite3` connection (tables: `visits`, `events`, `booking_requests`, `reviews`, `review_tags`, `hidden_ips`). Key behaviors:
- **DB path**: `DATA_DIR` env (mount a persistent volume at e.g. `/data` in prod) else `./data`. If the path isn't writable it falls back to an in-memory DB rather than crashing the site — analytics are lost but pages still render.
- **Schema migrations** are done imperatively at open time (`CREATE TABLE IF NOT EXISTS`, and `ALTER TABLE … ADD COLUMN` wrapped in try/catch since SQLite lacks `IF NOT EXISTS` for columns). Add new columns the same way.
- `serverExternalPackages: ["better-sqlite3"]` in `next.config.js` keeps the native module out of the client bundle — don't import `lib/db.ts` (or anything `"server-only"`) into client components.

Flow: client `Analytics.tsx`/`Tracker.tsx` POST to `app/api/track` → `recordVisit`/`recordEvent` (source classified by `lib/ua.ts`, section by `lib/section.ts`). Lead form POSTs to `app/api/booking-request` → `insertBookingRequest` + `notifyNewLead` (`lib/notify.ts`: Resend email + CallMeBot WhatsApp, each independently env-gated and **never throws** so a failed notification can't lose the lead). The `/admin` dashboard reads these tables.

### Auth — `lib/auth.ts`
Admin (`/admin`) uses a single `ADMIN_PASSWORD` + HMAC-signed cookie (`SESSION_SECRET`). Both are **mandatory in production** (the module throws at request time if missing/weak) and tolerated with a dev fallback otherwise. Admin POST routes also call `checkSameOrigin()` (anti-CSRF). Sessions slide (30d, auto-refreshed). Admin is `noindex` and excluded from the sitemap.

### Middleware — `middleware.ts`
IP blocklist returning 403 site-wide (anti-spam/troll). Add IPs to `DEFAULT_BLOCKED` (commit) or `BLOCKED_IPS` env (no deploy). Note: this runs *after* TLS termination, so it can't stop already-billed Google Ads clicks — exclude those IPs in Google Ads too.

## Conventions & gotchas
- Path alias `@/*` → repo root.
- All env vars are **optional except in production** for auth; everything analytics/pixel-related no-ops when unset. See `.env.example` and the README env table.
- Static assets in `public/` get 1-year immutable cache via `next.config.js` headers; `www → non-www` redirect lives there too.
- Google reviews: if `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` are set, real reviews (cached in the `reviews` table, accumulated over time since the API only returns 5) replace placeholder reviews, filtered per-section via `review_tags` (`lib/reviews.ts`). Refreshes hourly via Next revalidate.
- Deployment target is a self-hosted PaaS (Dokploy/Nixpacks, see `nixpacks.toml`) on a VPS with a persistent volume, not Vercel — keep the SQLite/native-module assumptions intact.
