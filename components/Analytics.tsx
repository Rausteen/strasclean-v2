"use client";

import Script from "next/script";

// ─────────────────────────────────────────────────────────────────────────
//  Analytics & tracking pub — piloté par variables d'environnement.
//
//  À renseigner dans Vercel (ou .env du serveur) :
//    NEXT_PUBLIC_GA_ID                  ex: G-XXXXXXX             (GA4)
//    NEXT_PUBLIC_GOOGLE_ADS_ID          ex: AW-17962141009        (Google Ads)
//    NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL    ex: AW-17962141009/axtcCP3o0qwcENGKgvVC
//    NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL ex: AW-17962141009/xxxxxxxx
//    NEXT_PUBLIC_META_PIXEL_ID          ex: 123456789012          (Meta Pixel)
//
//  Laisse vide → le bloc correspondant n'est pas chargé.
//
//  Tracking des conversions automatique :
//   - Clic WhatsApp (wa.me / whatsapp) → conversion "Contact"
//   - Clic téléphone (tel:)            → conversion "Phone call lead"
// ─────────────────────────────────────────────────────────────────────────

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADS_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL;
const ADS_PHONE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_LABEL;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const hasGtag = Boolean(GA_ID || ADS_ID);
const hasAnything = Boolean(GA_ID || ADS_ID || PIXEL_ID);

export default function Analytics() {
  if (!hasAnything) return null;

  const gtagIdForLoad = GA_ID || ADS_ID;

  // Injecté côté client en string pour le snippet de tracking
  const waLabelJs = ADS_WA_LABEL ? `'${ADS_WA_LABEL}'` : "null";
  const phoneLabelJs = ADS_PHONE_LABEL ? `'${ADS_PHONE_LABEL}'` : "null";

  return (
    <>
      {/* Google tag (gtag.js) — GA4 + Google Ads */}
      {hasGtag && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagIdForLoad}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
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

      {/* Tracking conversions : clics WhatsApp & téléphone */}
      <Script id="conversion-tracking" strategy="afterInteractive">
        {`
          (function(){
            var WA_SEND_TO = ${waLabelJs};
            var PHONE_SEND_TO = ${phoneLabelJs};

            document.addEventListener('click', function(e){
              var a = e.target && e.target.closest ? e.target.closest('a') : null;
              if (!a) return;
              var href = a.getAttribute('href') || '';
              var isWa = href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1;
              var isTel = href.indexOf('tel:') === 0;
              if (!isWa && !isTel) return;

              try {
                if (typeof gtag === 'function') {
                  // GA4 — événement générique (utile pour l'analyse)
                  gtag('event', isWa ? 'whatsapp_click' : 'phone_click', {
                    event_category: 'contact',
                    event_label: href,
                    value: 56
                  });
                  // Google Ads — conversion (si label fourni)
                  var sendTo = isWa ? WA_SEND_TO : PHONE_SEND_TO;
                  if (sendTo) {
                    gtag('event', 'conversion', { 'send_to': sendTo, 'value': 56, 'currency': 'EUR' });
                  }
                }
                if (typeof fbq === 'function') {
                  fbq('track', 'Lead', {
                    content_name: isWa ? 'whatsapp_click' : 'phone_click',
                    value: 56,
                    currency: 'EUR'
                  });
                }
              } catch (_) { /* silencieux */ }
            }, true);
          })();
        `}
      </Script>
    </>
  );
}
