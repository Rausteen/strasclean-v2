import { NextRequest, NextResponse } from "next/server";
import { insertLead, getUnnotifiedLeadId, markLeadTgNotified } from "@/lib/db";

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

// Rattrapage : la notification est pilotée par le flag leads.tg_notified (posé
// après chaque envoi Telegram), pas par la fraîcheur du lead. Si le poll tombe
// en panne (token invalidé…), les leads accumulés sont notifiés au retour du
// service. La borne de 72 h évite seulement de spammer un historique trop
// ancien (panne longue, base neuve) — au-delà, le lead est marqué sans envoi
// (il reste visible dans /equipe).
const NOTIFY_WINDOW_MS = 72 * 60 * 60 * 1000;

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

// Throttle module-level : une seule alerte panne par fenêtre de 6 h (process
// unique en prod, suffisant — repart à zéro au redémarrage, sans conséquence).
const ALERT_THROTTLE_MS = 6 * 60 * 60 * 1000;
let lastAlertAt = 0;

async function alertPollFailure(errors: string[], now: number): Promise<void> {
  if (now - lastAlertAt < ALERT_THROTTLE_MS) return;
  lastAlertAt = now;
  const detail = escapeHtml(errors[0].slice(0, 500));
  await sendTelegram(
    [
      "⚠️ <b>Poll Meta Ads en échec</b>",
      "Aucun formulaire lisible — token META_PAGE_ACCESS_TOKEN probablement expiré/invalidé.",
      `<code>${detail}</code>`,
    ].join("\n"),
  );
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

    // À notifier : lead tout juste inséré, OU déjà en base mais jamais poussé
    // sur Telegram (inséré pendant une panne d'envoi).
    const pendingId = isNew > 0 ? isNew : getUnnotifiedLeadId(lead.id);
    if (pendingId === 0) continue;

    const recent = now - parseTime(lead.created_time) <= NOTIFY_WINDOW_MS;
    if (recent) {
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
    // Marqué APRÈS l'envoi : si Telegram échoue (throw), le lead reste en
    // attente et sera retenté au poll suivant. Hors fenêtre → marqué sans
    // envoi pour solder le passif.
    markLeadTgNotified(pendingId);
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
  // Panne totale (tous les formulaires en erreur) → alerte Telegram throttlée,
  // pour ne pas découvrir un token mort 24 h plus tard.
  if (errors.length > 0 && errors.length === FORM_IDS.length) {
    try {
      await alertPollFailure(errors, now);
    } catch {
      // l'alerte ne doit jamais faire échouer le poll
    }
  }
  return NextResponse.json({ ok: true, notified: total, errors });
}
