"use client";

import Script from "next/script";

// ─────────────────────────────────────────────────────────────────────────
//  Analytics & tracking pub — piloté par variables d'environnement.
//
//  À renseigner dans .env de prod (ou Vercel) :
//
//  ── GA4 (un seul compte, cross-section) ──────────────────────────────
//    NEXT_PUBLIC_GA_ID                       ex: G-XXXXXXX
//
//  ── Google Ads AUTO (compte n°1) ─────────────────────────────────────
//    NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID          ex: AW-1111111111
//    NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL    ex: AW-1111111111/abcd...
//    NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL ex: AW-1111111111/wxyz...
//
//  ── Google Ads MAISON (compte n°2) ───────────────────────────────────
//    NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID          ex: AW-2222222222
//    NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL    ex: AW-2222222222/abcd...
//    NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL ex: AW-2222222222/wxyz...
//
//  ── Meta Pixel (optionnel) ───────────────────────────────────────────
//    NEXT_PUBLIC_META_PIXEL_ID               ex: 123456789012
//
//  Une variable vide = le bloc correspondant n'est pas chargé.
//
//  Fonctionnement des conversions :
//   - Au clic sur un lien wa.me/whatsapp → conversion "WhatsApp"
//   - Au clic sur un lien tel:           → conversion "Phone"
//   - La SECTION (auto vs maison) est détectée via window.location.pathname
//     au moment du clic et envoie la conv vers le BON compte Google Ads.
//
//  ⚠️ La logique de détection JS plus bas (isMaisonPath) doit rester
//  synchro avec lib/section.ts → isMaisonPathname.
// ─────────────────────────────────────────────────────────────────────────

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const ADS_AUTO_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_ID;
const ADS_AUTO_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL;
const ADS_AUTO_PHONE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL;

const ADS_MAISON_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID;
const ADS_MAISON_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL;
const ADS_MAISON_PHONE_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL;

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const hasGtag = Boolean(GA_ID || ADS_AUTO_ID || ADS_MAISON_ID);
const hasAnything = Boolean(
  GA_ID || ADS_AUTO_ID || ADS_MAISON_ID || PIXEL_ID,
);

export default function Analytics() {
  if (!hasAnything) return null;

  // N'importe quel ID gtag suffit pour charger gtag.js (la lib est commune).
  const gtagLoaderId = GA_ID || ADS_AUTO_ID || ADS_MAISON_ID;

  // Sérialisation des labels côté JS : 'STRING' si défini, sinon null
  const j = (v?: string) => (v ? `'${v}'` : "null");

  return (
    <>
      {/* Google tag (gtag.js) — GA4 + 2 comptes Google Ads */}
      {hasGtag && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoaderId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
              ${ADS_AUTO_ID ? `gtag('config', '${ADS_AUTO_ID}');` : ""}
              ${ADS_MAISON_ID ? `gtag('config', '${ADS_MAISON_ID}');` : ""}
            `}
          </Script>
        </>
      )}

      {/* Meta / Facebook Pixel */}
      {PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Tracking conversions : clics WhatsApp & téléphone, routés
          vers le bon compte Google Ads selon la section (auto/maison). */}
      <Script id="conversion-tracking" strategy="afterInteractive">
        {`
          (function(){
            var AUTO_WA   = ${j(ADS_AUTO_WA_LABEL)};
            var AUTO_TEL  = ${j(ADS_AUTO_PHONE_LABEL)};
            var MAISON_WA  = ${j(ADS_MAISON_WA_LABEL)};
            var MAISON_TEL = ${j(ADS_MAISON_PHONE_LABEL)};

            // Préfixes slug Maison — DOIT rester synchro avec lib/section.ts
            var MAISON_PREFIXES = [
              'nettoyage-canape-',
              'nettoyage-tapis-',
              'nettoyage-matelas-',
              'nettoyage-fauteuil-chaise-',
              'nettoyage-airbnb-',
              'prix-nettoyage-canape-',
              'prix-nettoyage-tapis-',
              'prix-nettoyage-matelas-',
              'prix-nettoyage-fauteuil-chaise-'
            ];

            function isMaisonPath(p){
              if (!p) return false;
              if (p === '/strasclean-maison') return true;
              if (p.indexOf('/strasclean-maison/') === 0) return true;
              if (p === '/maison') return true;
              var slug = p.replace(/^\\/+/, '').replace(/\\/.*$/, '');
              for (var i = 0; i < MAISON_PREFIXES.length; i++) {
                if (slug.indexOf(MAISON_PREFIXES[i]) === 0) return true;
              }
              return false;
            }

            // Tire une conversion (GA4 + Google Ads + Meta) pour un type de
            // contact ('whatsapp' | 'phone') et une section ('auto'|'maison').
            // Exposée en global (window.scConvert) pour être réutilisée à la
            // soumission du formulaire de réservation → un lead formulaire
            // compte alors comme une conversion WhatsApp dans Google Ads.
            function fireConversion(kind, section){
              var isWa = kind === 'whatsapp';
              var sendTo = section === 'maison'
                ? (isWa ? MAISON_WA : MAISON_TEL)
                : (isWa ? AUTO_WA : AUTO_TEL);
              try {
                if (typeof gtag === 'function') {
                  gtag('event', isWa ? 'whatsapp_click' : 'phone_click', {
                    event_category: 'contact',
                    section: section,
                    value: 56
                  });
                  if (sendTo) {
                    gtag('event', 'conversion', {
                      'send_to': sendTo,
                      'value': 56,
                      'currency': 'EUR'
                    });
                  }
                }
                if (typeof fbq === 'function') {
                  fbq('track', 'Lead', {
                    content_name: isWa ? 'whatsapp_click' : 'phone_click',
                    section: section,
                    value: 56,
                    currency: 'EUR'
                  });
                }
              } catch (_) { /* silencieux */ }
            }
            window.scConvert = fireConversion;

            document.addEventListener('click', function(e){
              var a = e.target && e.target.closest ? e.target.closest('a') : null;
              if (!a) return;
              var href = a.getAttribute('href') || '';
              var isWa  = href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1;
              var isTel = href.indexOf('tel:') === 0;
              if (!isWa && !isTel) return;

              var section = isMaisonPath(window.location.pathname) ? 'maison' : 'auto';
              fireConversion(isWa ? 'whatsapp' : 'phone', section);
            }, true);
          })();
        `}
      </Script>
    </>
  );
}
