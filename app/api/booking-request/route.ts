import { NextResponse } from "next/server";
import {
  insertBookingRequest,
  type BookingRequest,
} from "@/lib/db";
import { checkSameOrigin } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { HOME_SERVICES } from "@/lib/homeServices";
import { PLANS } from "@/lib/plans";

// On limite à 5 demandes par heure et par IP — protège contre l'abus
// tout en restant largement au-dessus d'un usage normal.
const RATE_LIMIT_OPTS = {
  bucket: "booking-request",
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000,
  lockoutMs: 60 * 60 * 1000,
};

const MAX_FIELD_LEN = 500;
const MAX_NOTES_LEN = 2000;

/** Trim + cap à N caractères. Renvoie null si vide après trim. */
function safe(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().slice(0, max);
  return v.length > 0 ? v : null;
}

/** Validation email très simple — on n'a pas besoin de la RFC complète. */
function isLikelyEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** Validation téléphone : au moins 8 chiffres dans la chaîne (FR / EU / +int). */
function isLikelyPhone(v: string): boolean {
  const digits = v.replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

/** Cherche un item (service Maison ou formule Auto) par section + id.
 *  Renvoie un label affichable et le slug stable pour la DB. */
function resolveItem(
  section: string,
  itemId: string,
): { slug: string; label: string } | null {
  if (section === "maison") {
    const s = HOME_SERVICES.find((s) => s.slug === itemId);
    return s ? { slug: s.slug, label: s.shortName } : null;
  }
  if (section === "auto") {
    const p = PLANS.find((p) => p.id === itemId);
    return p ? { slug: p.id, label: p.name } : null;
  }
  return null;
}

export async function POST(req: Request) {
  // 1) Garde-fous : CSRF + rate limit
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ error: "Origine refusée" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, RATE_LIMIT_OPTS);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  // 2) Parse + validation
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Format invalide" }, { status: 400 });
  }

  const section = safe(body.section, 20);
  if (section !== "auto" && section !== "maison") {
    return NextResponse.json(
      { error: "Section invalide" },
      { status: 400 },
    );
  }

  const itemId = safe(body.itemId, 100);
  const item = itemId ? resolveItem(section, itemId) : null;
  if (!item) {
    return NextResponse.json(
      { error: "Prestation inconnue" },
      { status: 400 },
    );
  }

  const firstName = safe(body.firstName, 80);
  const email = safe(body.email, MAX_FIELD_LEN);
  const phone = safe(body.phone, 40);

  if (!firstName) {
    return NextResponse.json(
      { error: "Prénom requis" },
      { status: 400 },
    );
  }
  if (!email || !isLikelyEmail(email)) {
    return NextResponse.json(
      { error: "Email invalide" },
      { status: 400 },
    );
  }
  if (!phone || !isLikelyPhone(phone)) {
    return NextResponse.json(
      { error: "Numéro de téléphone invalide" },
      { status: 400 },
    );
  }

  const variant = safe(body.variant, 200);
  const postalCode = safe(body.postalCode, 10);
  const addressNote = safe(body.addressNote, MAX_FIELD_LEN);
  const preferredDay = safe(body.preferredDay, 30);
  const preferredSlot = safe(body.preferredSlot, 30);
  const notes = safe(body.notes, MAX_NOTES_LEN);

  // 3) Persist
  const userAgent = req.headers.get("user-agent");

  const record: Omit<BookingRequest, "id" | "status"> = {
    ts: Date.now(),
    section,
    service_slug: item.slug,
    service_label: item.label,
    variant,
    first_name: firstName,
    email,
    phone,
    postal_code: postalCode,
    address_note: addressNote,
    preferred_day: preferredDay,
    preferred_slot: preferredSlot,
    notes,
    ip,
    user_agent: userAgent,
  };

  let id: number;
  try {
    id = insertBookingRequest(record);
  } catch (err) {
    console.error("Booking request insert failed", err);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez ou contactez-nous par WhatsApp." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id });
}
