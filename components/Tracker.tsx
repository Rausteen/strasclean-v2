"use client";

import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────
//  Tracker — envoie chaque page vue + chaque clic WhatsApp/téléphone à
//  /api/track. Indépendant du tracking Google Ads (qui reste en place).
//  Pas de tracking en /admin/* (on n'analyse pas le propriétaire du site).
// ─────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "strasclean_sid";

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const sid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sid);
    return sid;
  } catch {
    return "anon";
  }
}

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([body], { type: "application/json" }),
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* silencieux — pas question de bloquer l'UX */
  }
}

export default function Tracker() {
  useEffect(() => {
    // Ne pas tracker l'admin
    if (window.location.pathname.startsWith("/admin")) return;

    const sid = getOrCreateSessionId();

    // ─── Page view ────────────────────────────────────────────────────
    send({
      type: "pageview",
      sid,
      path: window.location.pathname,
      query: window.location.search,
      referer: document.referrer || null,
    });

    // ─── Click tracking : WhatsApp + tel: ────────────────────────────
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const isWa = href.includes("wa.me") || href.includes("whatsapp");
      const isTel = href.startsWith("tel:");
      if (!isWa && !isTel) return;
      send({
        type: isWa ? "whatsapp_click" : "phone_click",
        sid,
        path: window.location.pathname,
        href,
      });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
