import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { insertLead, getUnnotifiedLeadId, markLeadTgNotified } from "@/lib/db";

// ─────────────────────────────────────────────────────────────────────────
//  Webhook Meta Lead Ads → Telegram (instantané).
//
//  Meta appelle cette URL dès qu'un lead est soumis sur une pub Facebook/
//  Instagram. On récupère les champs du lead via la Graph API, puis on
//  envoie un message Telegram. Pas de polling → temps réel.
//
//  URL à configurer côté Meta :  https://strasclean.fr/api/meta-leads
//
//  Variables d'env requises (voir .env.example) :
//    META_VERIFY_TOKEN        chaîne secrète choisie par toi (identique à
//                             celle saisie dans la config du webhook Meta)
//    META_APP_SECRET          secret de l'app Meta (vérifie la signature)
//    META_PAGE_ACCESS_TOKEN   token de page longue durée (perm. leads_retrieval)
//    TELEGRAM_BOT_TOKEN       token du bot (via @BotFather)
//    TELEGRAM_CHAT_ID         ton chat id (ou id d'un groupe)
// ─────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const APP_SECRET = process.env.META_APP_SECRET;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;
const GRAPH_VERSION = "v21.0";

type LeadChangeValue = {
  leadgen_id?: string;
  form_id?: string;
  ad_id?: string;
  created_time?: number;
};
type WebhookBody = {
  object?: string;
  entry?: { changes?: { field?: string; value?: LeadChangeValue }[] }[];
};
type LeadDetails = {
  field_data?: { name: string; values: string[] }[];
  created_time?: string;
  ad_id?: string;
  form_id?: string;
};

// ── Vérification du webhook (Meta envoie un GET une seule fois au setup) ──
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const mode = p.get("hub.mode");
  const token = p.get("hub.verify_token");
  const challenge = p.get("hub.challenge");
  if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Clé brute Meta (ex. "quand_souhaitez-vous_le_nettoyage_?") → libellé lisible.
function humanize(key: string): string {
  const s = key.replace(/[_-]+/g, " ").replace(/\?+\s*$/, "").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key;
}

// Vérifie la signature Meta (X-Hub-Signature-256). Si aucun APP_SECRET n'est
// configuré, on ne bloque pas (utile pour tester), mais c'est recommandé.
function verifySignature(raw: string, header: string | null): boolean {
  if (!APP_SECRET) return true;
  if (!header) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", APP_SECRET).update(raw, "utf8").digest("hex");
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function fetchLead(leadgenId: string): Promise<LeadDetails> {
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}` +
    `?fields=field_data,created_time,ad_id,form_id&access_token=${PAGE_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Graph API ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as LeadDetails;
}

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

const KNOWN_KEYS = [
  "full_name",
  "name",
  "first_name",
  "last_name",
  "phone_number",
  "phone",
  "email",
];

async function handleLead(leadgenId: string): Promise<void> {
  try {
    const lead = await fetchLead(leadgenId);
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
    const wa = phoneClean
      ? `https://wa.me/${phoneClean.replace(/^\+/, "")}`
      : "";

    // Stockage du prospect (best-effort, dédup sur l'id Meta). Ne doit jamais
    // empêcher la notification Telegram.
    let insertedId = 0;
    try {
      insertedId = insertLead({
        source: "meta_ads",
        meta_lead_id: leadgenId,
        form_id: lead.form_id ?? null,
        ad_id: lead.ad_id ?? null,
        full_name: name !== "—" ? name : null,
        phone: phoneClean || null,
        email: email || null,
        raw: JSON.stringify(lead.field_data ?? []),
      });
    } catch {
      /* stockage best-effort */
    }

    // Champs personnalisés du formulaire (hors champs standards)
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

    // Flag partagé avec le poll de rattrapage : notifié ici → le poll ne
    // renverra pas ce lead une seconde fois.
    try {
      const pendingId = insertedId > 0 ? insertedId : getUnnotifiedLeadId(leadgenId);
      if (pendingId > 0) markLeadTgNotified(pendingId);
    } catch {
      /* best-effort */
    }
  } catch (e) {
    // On prévient quand même sur Telegram pour ne jamais perdre un lead.
    await sendTelegram(
      `⚠️ Lead Meta reçu (id ${escapeHtml(leadgenId)}) mais erreur de récupération : ${escapeHtml(String(e))}`,
    );
  }
}

// ── Réception des leads (POST de Meta) ──
export async function POST(req: NextRequest) {
  const raw = await req.text();

  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Bad signature", { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (body.object !== "page") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const tasks: Promise<void>[] = [];
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "leadgen") continue;
      const id = change.value?.leadgen_id;
      if (id) tasks.push(handleLead(id));
    }
  }
  // Rapide → on répond 200 (sinon Meta réessaie).
  await Promise.allSettled(tasks);
  return NextResponse.json({ ok: true });
}
