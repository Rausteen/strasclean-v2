# StrasClean — Landing page

Site web ultra-convertissant pour StrasClean, service de nettoyage auto à
domicile à Strasbourg et alentours.

Stack : Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS.

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm run start    # lance le build
```

## Modifier le numéro / WhatsApp / zones

Tout est centralisé dans `lib/site.ts` :

- `phoneDisplay` / `phoneHref` — numéro de téléphone (placeholder `+33 6 00 00 00 00`)
- `whatsappNumber` / `whatsappHref` — lien WhatsApp (placeholder `33600000000`)
- `email` — adresse email
- `ZONES` — liste des communes desservies (header, hero, footer, section zone)

Le helper `waLink(message)` génère un lien WhatsApp avec un message prérempli
(utilisé sur les CTA des formules et de la section "options").

## Remplacer les images placeholder

Le site fonctionne sans aucune photo : tous les visuels sont des
**SVG/gradients premium** générés inline.

Pour ajouter de vraies photos :

- **Hero** — `components/Hero.tsx` : remplacer le composant `CarMock`
  (SVG inline) par un `<Image src="/hero.jpg" .../>`.
- **Avant / Après** — `components/BeforeAfter.tsx` : remplacer `PlaceholderTile`
  par `<Image src="/avant-1.jpg" alt="..." />` et `<Image src="/apres-1.jpg" .../>`.
- **OG image** — `public/og.svg` (référencée dans `app/layout.tsx`). Remplacer
  par un `og.jpg` 1200×630 et mettre à jour le chemin dans la metadata.
- **Favicon** — `public/favicon.svg`.

Place les images dans `public/` et utilise `next/image` pour la performance.

## Personnaliser le copywriting

- Hero / titres principaux : `components/Hero.tsx`, `components/FinalCTA.tsx`.
- Formules et prix : `components/PricingSection.tsx` (constante `PLANS`).
- Avis : `components/Testimonials.tsx` (constante `REVIEWS`).
- FAQ : `components/FAQ.tsx` (constante `FAQS`).
- SEO (title, description, OG, JSON-LD) : `app/layout.tsx`.

## Structure

```
app/
  layout.tsx        # SEO global, fonts, JSON-LD AutoDetailing
  page.tsx          # Assemblage de toutes les sections
  globals.css       # Tailwind + composants utilitaires (.btn, .card…)
  sitemap.ts        # Sitemap dynamique
components/
  Header.tsx
  Hero.tsx
  TrustBar.tsx
  ProblemsSolution.tsx
  PricingSection.tsx
  BeforeAfter.tsx
  HowItWorks.tsx
  Benefits.tsx
  ServiceArea.tsx
  Testimonials.tsx
  MidCTA.tsx
  FAQ.tsx
  FinalCTA.tsx
  Footer.tsx
  FloatingWhatsApp.tsx   # Sticky CTA mobile + bouton flottant desktop
  Reveal.tsx             # Animation d'apparition au scroll
  Icon.tsx               # Icônes SVG inline (zéro dépendance)
lib/
  site.ts                # ⚙️ Config centrale (numéro, WhatsApp, zones)
public/
  favicon.svg
  og.svg                 # Open Graph par défaut
  robots.txt
```

## Prochaines améliorations

- Ajouter de vraies photos avant/après et un slider interactif (drag handle).
- Brancher Google Analytics 4 / Meta Pixel / TikTok Pixel pour Ads.
- Ajouter un module avis Google embarqué (vrais reviews).
- Page `/mentions-legales` et `/politique-de-confidentialite`.
- Schema.org : ajouter `aggregateRating` quand les avis Google seront connectés.
- Galerie multi-photos par formule (carrousel).
- Variantes A/B sur le hero (H1, CTA) pour optimiser le taux de conversion.
- Multi-langue (FR/DE) si pertinent côté frontalier.
