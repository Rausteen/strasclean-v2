import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";

// ─────────────────────────────────────────────────────────────────────────
//  Polling des Lead Ads (contourne l'accès avancé leads_retrieval).
//
//  La lecture en masse `GET /{form}/leads` marche avec un Page token dès
//  maintenant (données de TA page). Ce endpoint, appelé par un cron toutes
//  les ~10 min, récupère les leads, détecte les NOUVEAUX (dédup via la table
//  `leads`) et pousse les récents sur Telegram — SANS attendre l'accès avancé.
//
//  À déclencher par un cron (Dokploy scheduled task, cron-job.org, etc.) :
//    GET https://strasclean.fr/api/meta-leads/poll?key=<META_POLL_SECRET>
//
//  Env requis :
//    META_PAGE_ACCESS_TOKEN   token de page permanent (leads_retrieval)
//    META_LEAD_FORM_IDS       id(s) de formulaire, séparés par virgule
//    META_POLL_SECRET         secret protégeant l'URL du cron
//    TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
// ─────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const FORM_IDS = (process.env.META_LEAD_FORM_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const POLL_SECRET = process.env.META_POLL_SECRET;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;
const GRAPH_VERSION = "v21.0";

// Fenêtre de notification : on ne pousse sur Telegram que les leads créés dans
// les 45 dernières minutes (large devant l'intervalle de cron) → évite de
// spammer tout l'historique au 1ᵉʳ passage. La dédup (table leads) empêche les
// doublons entre deux passages.
const NOTIFY_WINDOW_MS = 45 * 60 * 1000;

type LeadRow = {
  id: string;
  created_time?: string;
  ad_id?: string;
  form_id?: string;
  field_data?: { name: string; values: string[] }[];
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Clé brute Meta (ex. "quand_souhaitez-vous_le_nettoyage_?") → libellé lisible.
function humanize(key: string): string {
  const s = key
    .replace(/[_-]+/g, " ")
    .replace(/\?+\s*$/, "")
    .trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key;
}

const KNOWN_KEYS = [
  "full_name",
  "name",
  "first_name",
  "last_name",
  "phone_number",
  "phone",
  "email",
];

async function sendTelegram(text: string): Promise<void> {
  if (!TG_TOKEN || !TG_CHAT) return;
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

// "2026-07-02T17:58:44+0000" → timestamp (ms). Normalise l'offset +0000.
function parseTime(s?: string): number {
  if (!s) return 0;
  const iso = s.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
}

async function pollForm(formId: string, now: number): Promise<number> {
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${formId}/leads` +
    `?fields=created_time,field_data,ad_id,form_id&limit=50&access_token=${PAGE_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Graph ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: LeadRow[] };
  let notified = 0;

  for (const lead of json.data ?? []) {
    const map: Record<string, string> = {};
    for (const f of lead.field_data ?? []) {
      map[f.name] = (f.values ?? []).join(", ");
    }
    const name =
      map.full_name ||
      map.name ||
      `${map.first_name ?? ""} ${map.last_name ?? ""}`.trim() ||
      "—";
    const phone = map.phone_number || map.phone || "";
    const email = map.email || "";
    const phoneClean = phone.replace(/[^\d+]/g, "");

    // Dédup : nouveau lead seulement si insertLead renvoie un id > 0.
    const isNew = insertLead({
      source: "meta_ads",
      meta_lead_id: lead.id,
      form_id: lead.form_id ?? formId,
      ad_id: lead.ad_id ?? null,
      full_name: name !== "—" ? name : null,
      phone: phoneClean || null,
      email: email || null,
      raw: JSON.stringify(lead.field_data ?? []),
    });

    const recent = now - parseTime(lead.created_time) <= NOTIFY_WINDOW_MS;
    if (isNew > 0 && recent) {
      const wa = phoneClean
        ? `https://wa.me/${phoneClean.replace(/^\+/, "")}`
        : "";
      const extras = Object.entries(map)
        .filter(([k]) => !KNOWN_KEYS.includes(k))
        .map(([k, v]) => `• ${escapeHtml(humanize(k))} : <b>${escapeHtml(v)}</b>`);
      const lines = [
        "🎯 <b>Nouveau lead Meta Ads</b>",
        `👤 <b>${escapeHtml(name)}</b>`,
        phone
          ? `📞 <a href="tel:${escapeHtml(phoneClean)}">${escapeHtml(phone)}</a>`
          : "",
        email ? `✉️ ${escapeHtml(email)}` : "",
        ...extras,
        wa ? `\n💬 <a href="${wa}">Répondre sur WhatsApp</a>` : "",
      ].filter(Boolean);
      await sendTelegram(lines.join("\n"));
      notified++;
    }
  }
  return notified;
}

export async function GET(req: NextRequest) {
  if (!POLL_SECRET || req.nextUrl.searchParams.get("key") !== POLL_SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (!PAGE_TOKEN || FORM_IDS.length === 0) {
    return NextResponse.json(
      { ok: false, error: "META_PAGE_ACCESS_TOKEN ou META_LEAD_FORM_IDS manquant" },
      { status: 500 },
    );
  }

  const now = Date.now();
  let total = 0;
  const errors: string[] = [];
  for (const formId of FORM_IDS) {
    try {
      total += await pollForm(formId, now);
    } catch (e) {
      errors.push(`${formId}: ${String(e)}`);
    }
  }
  return NextResponse.json({ ok: true, notified: total, errors });
}
