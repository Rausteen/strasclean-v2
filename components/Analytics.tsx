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
//    NEXT_PUBLIC_GOOGLE_ADS_AUTO_LABEL       ex: AW-1111111111/contact
//        → libellé UNIQUE « Contact » (regroupe WhatsApp + tél + formulaire)
//    (facultatif, pour séparer par canal :)
//    NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL / _PHONE_LABEL / _FORM_LABEL
//
//  ── Google Ads MAISON (compte n°2) ───────────────────────────────────
//    NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID          ex: AW-2222222222
//    NEXT_PUBLIC_GOOGLE_ADS_MAISON_LABEL       ex: AW-2222222222/contact
//    (facultatif :) _WA_LABEL / _PHONE_LABEL / _FORM_LABEL
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
// Libellé de conversion UNIQUE « Contact » : une seule action regroupe
// WhatsApp + téléphone + formulaire (option simple, recommandée). Les 3
// libellés par canal ci-dessous sont FACULTATIFS — à renseigner uniquement
// pour séparer les conversions par canal ; sinon tout retombe sur ce libellé.
const ADS_AUTO_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_LABEL;
const ADS_AUTO_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_WA_LABEL;
const ADS_AUTO_PHONE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_PHONE_LABEL;
const ADS_AUTO_FORM_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUTO_FORM_LABEL;

const ADS_MAISON_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_ID;
const ADS_MAISON_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_LABEL;
const ADS_MAISON_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_WA_LABEL;
const ADS_MAISON_PHONE_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_PHONE_LABEL;
const ADS_MAISON_FORM_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_MAISON_FORM_LABEL;

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
            // Libellé unique par section, avec repli par canal (facultatif).
            var AUTO_LABEL = ${j(ADS_AUTO_LABEL)};
            var AUTO_WA   = ${j(ADS_AUTO_WA_LABEL)} || AUTO_LABEL;
            var AUTO_TEL  = ${j(ADS_AUTO_PHONE_LABEL)} || AUTO_LABEL;
            var AUTO_FORM = ${j(ADS_AUTO_FORM_LABEL)} || AUTO_LABEL;
            var MAISON_LABEL = ${j(ADS_MAISON_LABEL)};
            var MAISON_WA  = ${j(ADS_MAISON_WA_LABEL)} || MAISON_LABEL;
            var MAISON_TEL = ${j(ADS_MAISON_PHONE_LABEL)} || MAISON_LABEL;
            var MAISON_FORM = ${j(ADS_MAISON_FORM_LABEL)} || MAISON_LABEL;
            var PIXEL_ID = ${j(PIXEL_ID)};

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

            // Tire une conversion (GA4 + Google Ads + Meta) pour un type
            // d'action : 'whatsapp' | 'phone' | 'form', routée vers le bon
            // compte selon la section ('auto'|'maison'). Exposée en global
            // (window.scConvert) → utilisée par les clics ET la soumission du
            // formulaire de réservation. Pour 'form', on cible l'action de
            // conversion dédiée si elle existe, sinon repli sur le label
            // WhatsApp (la soumission compte quand même).
            // Advanced Matching Meta : passe les infos client (email, tél, nom,
            // CP) au pixel. Le SDK Meta les HASH côté navigateur (SHA-256) avant
            // envoi → améliore la correspondance des conversions. On ré-init le
            // pixel avec ces données juste avant de tirer l'event.
            function amInit(d){
              if (typeof fbq !== 'function' || !PIXEL_ID || !d) return;
              if (!d.email && !d.phone) return;
              var am = {};
              if (d.email)      am.em = String(d.email).trim().toLowerCase();
              if (d.phone)      am.ph = String(d.phone).replace(/[^0-9]/g,'');
              if (d.firstName)  am.fn = String(d.firstName).trim().toLowerCase();
              if (d.lastName)   am.ln = String(d.lastName).trim().toLowerCase();
              if (d.postalCode) am.zp = String(d.postalCode).trim();
              try { fbq('init', PIXEL_ID, am); } catch (_) {}
            }

            function fireConversion(kind, section, data){
              var maison = section === 'maison';
              var sendTo;
              if (kind === 'form') {
                sendTo = maison ? (MAISON_FORM || MAISON_WA)
                                : (AUTO_FORM || AUTO_WA);
              } else if (kind === 'phone') {
                sendTo = maison ? MAISON_TEL : AUTO_TEL;
              } else {
                sendTo = maison ? MAISON_WA : AUTO_WA;
              }
              var ga4Event = kind === 'form' ? 'generate_lead'
                           : kind === 'phone' ? 'phone_click'
                           : 'whatsapp_click';
              // Valeur unique pour toutes les conversions : WhatsApp,
              // téléphone et formulaire sont regroupés dans UNE seule action
              // « Contact » côté Google Ads (plus simple). Ajustable ici.
              var value = 56;
              try {
                if (typeof gtag === 'function') {
                  gtag('event', ga4Event, {
                    event_category: kind === 'form' ? 'lead' : 'contact',
                    section: section,
                    value: value
                  });
                  if (sendTo) {
                    gtag('event', 'conversion', {
                      'send_to': sendTo,
                      'value': value,
                      'currency': 'EUR'
                    });
                  }
                }
                if (typeof fbq === 'function') {
                  amInit(data);
                  fbq('track', 'Lead', {
                    content_name: ga4Event,
                    section: section,
                    value: value,
                    currency: 'EUR'
                  });
                }
              } catch (_) { /* silencieux */ }
            }
            window.scConvert = fireConversion;

            // Réservation en ligne confirmée → event Meta 'Schedule' dédié
            // (+ GA4/Ads), avec la vraie valeur du RDV et l'advanced matching.
            function fireReserve(opts){
              opts = opts || {};
              var value = opts.value || 0;
              try {
                if (typeof gtag === 'function') {
                  gtag('event', 'schedule', { section: 'auto', value: value });
                  var sendTo = AUTO_FORM || AUTO_WA;
                  if (sendTo) {
                    gtag('event', 'conversion', {
                      'send_to': sendTo, 'value': value, 'currency': 'EUR'
                    });
                  }
                }
                if (typeof fbq === 'function') {
                  amInit(opts);
                  fbq('track', 'Schedule', {
                    value: value,
                    currency: 'EUR',
                    content_name: opts.service || 'reservation-auto'
                  });
                }
              } catch (_) { /* silencieux */ }
            }
            window.scReserve = fireReserve;

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
