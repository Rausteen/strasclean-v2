"use client";

import Script from "next/script";

// ─────────────────────────────────────────────────────────────────────────
//  Analytics & tracking pub — piloté par variables d'environnement.
//  Renseigne ces variables dans Vercel (ou .env du serveur) :
//    NEXT_PUBLIC_GA_ID            ex: G-XXXXXXX     (Google Analytics 4)
//    NEXT_PUBLIC_GOOGLE_ADS_ID    ex: AW-XXXXXXX    (Google Ads)
//    NEXT_PUBLIC_META_PIXEL_ID    ex: 123456789012  (Meta / Facebook Pixel)
//  Laisse vide → le bloc correspondant n'est pas chargé (aucun script inutile).
//
//  Le tracking de conversion (clics WhatsApp + clics téléphone) est
//  automatiquement câblé dès qu'un des trois IDs est défini.
// ─────────────────────────────────────────────────────────────────────────

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// Optionnel : libellé de conversion Google Ads ("AW-XXX/abcdEFGH")
const ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

const hasGtag = Boolean(GA_ID || ADS_ID);
const hasAnything = Boolean(GA_ID || ADS_ID || PIXEL_ID);

export default function Analytics() {
  if (!hasAnything) return null;

  const gtagId = GA_ID || ADS_ID;

  return (
    <>
      {hasGtag && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
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

      {/* Tracking conversions : clics WhatsApp & téléphone (les vraies conversions du site) */}
      <Script id="conversion-tracking" strategy="afterInteractive">
        {`
          (function(){
            document.addEventListener('click', function(e){
              var a = e.target && e.target.closest ? e.target.closest('a') : null;
              if(!a) return;
              var href = a.getAttribute('href') || '';
              var isWa = href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1;
              var isTel = href.indexOf('tel:') === 0;
              if(!isWa && !isTel) return;
              var label = isWa ? 'whatsapp_click' : 'phone_click';
              try {
                if(typeof gtag === 'function'){
                  gtag('event', label, { event_category: 'contact', event_label: href });
                  ${ADS_ID && ADS_CONVERSION_LABEL ? `gtag('event', 'conversion', { send_to: '${ADS_CONVERSION_LABEL}' });` : ADS_ID ? `gtag('event', 'conversion', { send_to: '${ADS_ID}' });` : ""}
                }
                if(typeof fbq === 'function'){
                  fbq('track', 'Lead', { content_name: label });
                }
              } catch(_) {}
            }, true);
          })();
        `}
      </Script>
    </>
  );
}
