"use client";

import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────
//  Analytics & tracking pub — config lue au RUNTIME via /api/tracking.
//  → changer un ID (pixel, GA, Ads) dans l'hébergeur + restart suffit,
//    SANS rebuild. Voir app/api/tracking/route.ts pour les variables d'env.
//
//  Événements posés :
//   - PageView (Meta) + config GA4/Ads au chargement
//   - Contact (GA4 + Ads + Meta 'Lead') : clic WhatsApp/téléphone/formulaire
//   - InitiateCheckout (Meta) : début de réservation
//   - Réservation (Ads « Réservation » primary + Meta 'Schedule') : RDV confirmé
//   - Advanced Matching Meta (email/tél/nom/CP hashés côté client)
//
//  ⚠️ MAISON_PREFIXES doit rester synchro avec lib/section.ts.
// ─────────────────────────────────────────────────────────────────────────

type Ads = {
  id?: string | null;
  label?: string | null;
  reservation?: string | null;
  wa?: string | null;
  phone?: string | null;
  form?: string | null;
};
type Cfg = {
  gaId?: string | null;
  pixelId?: string | null;
  adsAuto?: Ads;
  adsMaison?: Ads;
};

const MAISON_PREFIXES = [
  "nettoyage-canape-",
  "nettoyage-tapis-",
  "nettoyage-matelas-",
  "nettoyage-fauteuil-chaise-",
  "nettoyage-airbnb-",
  "prix-nettoyage-canape-",
  "prix-nettoyage-tapis-",
  "prix-nettoyage-matelas-",
  "prix-nettoyage-fauteuil-chaise-",
];

function isMaisonPath(p: string): boolean {
  if (!p) return false;
  if (p === "/strasclean-maison") return true;
  if (p.indexOf("/strasclean-maison/") === 0) return true;
  if (p === "/maison") return true;
  const slug = p.replace(/^\/+/, "").replace(/\/.*$/, "");
  return MAISON_PREFIXES.some((pre) => slug.indexOf(pre) === 0);
}

let installed = false;

/* eslint-disable @typescript-eslint/no-explicit-any */
function install(cfg: Cfg) {
  const w = window as any;
  const gaId = cfg.gaId || null;
  const pixelId = cfg.pixelId || null;
  const auto = cfg.adsAuto || {};
  const maison = cfg.adsMaison || {};
  const adsAutoId = auto.id || null;
  const adsMaisonId = maison.id || null;

  const AUTO_LABEL = auto.label || null;
  const AUTO_WA = auto.wa || AUTO_LABEL;
  const AUTO_TEL = auto.phone || AUTO_LABEL;
  const AUTO_FORM = auto.form || AUTO_LABEL;
  const AUTO_RESA = auto.reservation || AUTO_FORM || AUTO_LABEL;
  const MAISON_LABEL = maison.label || null;
  const MAISON_WA = maison.wa || MAISON_LABEL;
  const MAISON_TEL = maison.phone || MAISON_LABEL;
  const MAISON_FORM = maison.form || MAISON_LABEL;

  const hasGtag = !!(gaId || adsAutoId || adsMaisonId);
  if (!hasGtag && !pixelId) return;

  // 1) Google tag (gtag.js) — GA4 + comptes Ads
  if (hasGtag) {
    const loaderId = gaId || adsAutoId || adsMaisonId;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${loaderId}`;
    document.head.appendChild(s);
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function gtag() { w.dataLayer.push(arguments); };
    w.gtag("js", new Date());
    if (gaId) w.gtag("config", gaId);
    if (adsAutoId) w.gtag("config", adsAutoId);
    if (adsMaisonId) w.gtag("config", adsMaisonId);
  }

  // 2) Meta / Facebook Pixel
  if (pixelId) {
    (function (f: any, b: any, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e);
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(w, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    w.fbq("init", pixelId);
    w.fbq("track", "PageView");
  }

  // Advanced Matching Meta : infos client hashées côté navigateur (SHA-256).
  function amInit(d: any) {
    if (typeof w.fbq !== "function" || !pixelId || !d) return;
    if (!d.email && !d.phone) return;
    const am: any = {};
    if (d.email) am.em = String(d.email).trim().toLowerCase();
    if (d.phone) am.ph = String(d.phone).replace(/[^0-9]/g, "");
    if (d.firstName) am.fn = String(d.firstName).trim().toLowerCase();
    if (d.lastName) am.ln = String(d.lastName).trim().toLowerCase();
    if (d.postalCode) am.zp = String(d.postalCode).trim();
    try {
      w.fbq("init", pixelId, am);
    } catch (_) {}
  }

  // Contact (WhatsApp / téléphone / formulaire) → GA4 + Ads + Meta 'Lead'.
  function fireConversion(kind: string, section: string, data?: any) {
    const isMaison = section === "maison";
    let sendTo;
    if (kind === "form") sendTo = isMaison ? MAISON_FORM || MAISON_WA : AUTO_FORM || AUTO_WA;
    else if (kind === "phone") sendTo = isMaison ? MAISON_TEL : AUTO_TEL;
    else sendTo = isMaison ? MAISON_WA : AUTO_WA;
    const ga4Event = kind === "form" ? "generate_lead" : kind === "phone" ? "phone_click" : "whatsapp_click";
    const value = 56;
    try {
      if (typeof w.gtag === "function") {
        w.gtag("event", ga4Event, { event_category: kind === "form" ? "lead" : "contact", section, value });
        if (sendTo) w.gtag("event", "conversion", { send_to: sendTo, value, currency: "EUR" });
      }
      if (typeof w.fbq === "function") {
        amInit(data);
        w.fbq("track", "Lead", { content_name: ga4Event, section, value, currency: "EUR" });
      }
    } catch (_) {}
  }
  w.scConvert = fireConversion;

  // Début de réservation (choix du véhicule) → Meta 'InitiateCheckout'.
  function fireCheckout(opts: any) {
    opts = opts || {};
    try {
      if (typeof w.fbq === "function") {
        const d: any = { currency: "EUR" };
        if (opts.value) d.value = opts.value;
        if (opts.service) d.content_name = opts.service;
        w.fbq("track", "InitiateCheckout", d);
      }
    } catch (_) {}
  }
  w.scInitiateCheckout = fireCheckout;

  // Réservation confirmée → Ads « Réservation » (primary, prix réel) + Meta 'Schedule'.
  function fireReserve(opts: any) {
    opts = opts || {};
    const value = opts.value || 0;
    try {
      if (typeof w.gtag === "function") {
        w.gtag("event", "schedule", { section: "auto", value });
        if (AUTO_RESA) w.gtag("event", "conversion", { send_to: AUTO_RESA, value, currency: "EUR" });
      }
      if (typeof w.fbq === "function") {
        amInit(opts);
        w.fbq("track", "Schedule", { value, currency: "EUR", content_name: opts.service || "reservation-auto" });
      }
    } catch (_) {}
  }
  w.scReserve = fireReserve;

  // Clics WhatsApp / téléphone → conversion Contact, section auto/maison.
  document.addEventListener(
    "click",
    function (e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const a = target && target.closest ? target.closest("a") : null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const isWa = href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1;
      const isTel = href.indexOf("tel:") === 0;
      if (!isWa && !isTel) return;
      const section = isMaisonPath(window.location.pathname) ? "maison" : "auto";
      fireConversion(isWa ? "whatsapp" : "phone", section);
    },
    true,
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function Analytics() {
  useEffect(() => {
    if (installed) return;
    installed = true;
    let cancelled = false;
    fetch("/api/tracking")
      .then((r) => r.json())
      .then((cfg: Cfg) => {
        if (!cancelled) install(cfg);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
