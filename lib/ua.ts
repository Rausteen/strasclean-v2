// Mini parser User-Agent — zéro dépendance, couvre 99 % des cas.

export type ParsedUA = {
  device: "mobile" | "tablet" | "desktop" | "bot" | "unknown";
  os: string;
  browser: string;
};

export function parseUserAgent(ua: string | null | undefined): ParsedUA {
  if (!ua) return { device: "unknown", os: "Unknown", browser: "Unknown" };
  const u = ua;

  // Bot detection (basique)
  if (/bot|crawler|spider|crawling|googlebot|bingbot|duckduckbot|facebookexternalhit|slurp|baiduspider/i.test(u)) {
    return { device: "bot", os: "Bot", browser: "Bot" };
  }

  // Device
  let device: ParsedUA["device"] = "desktop";
  if (/iPad|Tablet|Kindle|PlayBook/i.test(u)) device = "tablet";
  else if (/Mobile|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(u)) device = "mobile";

  // OS
  let os = "Unknown";
  if (/Windows NT 10/i.test(u)) os = "Windows";
  else if (/Windows/i.test(u)) os = "Windows";
  else if (/iPhone|iPad|iPod|iOS/i.test(u)) os = "iOS";
  else if (/Mac OS X|Macintosh/i.test(u)) os = "macOS";
  else if (/Android/i.test(u)) os = "Android";
  else if (/Linux/i.test(u)) os = "Linux";

  // Browser (ordre important : Edge avant Chrome, Chrome avant Safari)
  let browser = "Unknown";
  if (/Edg\//i.test(u)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(u)) browser = "Opera";
  else if (/Firefox/i.test(u)) browser = "Firefox";
  else if (/Chrome\//i.test(u) && !/Chromium/i.test(u)) browser = "Chrome";
  else if (/Safari/i.test(u)) browser = "Safari";
  else if (/Chromium/i.test(u)) browser = "Chromium";

  return { device, os, browser };
}

// ─── Classification de la source de la visite ──────────────────────────
export type TrafficSource = "ads" | "organic" | "direct" | "referral" | "social";

export function classifySource(
  params: Record<string, string | undefined>,
  referer: string | null,
): TrafficSource {
  // 1) Signaux pub explicites
  if (
    params.gclid ||
    params.gad_source ||
    params.utm_medium === "cpc" ||
    params.utm_medium === "ppc" ||
    params.utm_medium === "paid" ||
    params.utm_source === "google_ads" ||
    params.utm_source === "googleads"
  ) {
    return "ads";
  }
  if (params.fbclid || params.utm_source === "facebook" || params.utm_source === "instagram") {
    return "social";
  }
  if (params.utm_source === "tiktok" || params.utm_source === "snapchat") {
    return "social";
  }

  // 2) Pas de referer = direct (tapé en URL, bookmark, app mobile, etc.)
  if (!referer) return "direct";

  // 3) Parse referer
  let host = "";
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    return "referral";
  }

  // Self-referral → direct
  if (host.includes("strasclean.fr")) return "direct";

  // Moteurs de recherche → organic
  if (
    /google\./.test(host) ||
    /bing\.com/.test(host) ||
    /duckduckgo\./.test(host) ||
    /yahoo\./.test(host) ||
    /ecosia\./.test(host) ||
    /qwant\./.test(host) ||
    /yandex\./.test(host)
  ) {
    return "organic";
  }

  // Réseaux sociaux
  if (
    /facebook\.com|fb\.com|t\.co|twitter\.com|x\.com|instagram\.com|tiktok\.com|linkedin\.com|reddit\.com|youtube\.com|youtu\.be|whatsapp\.com/.test(
      host,
    )
  ) {
    return "social";
  }

  return "referral";
}
