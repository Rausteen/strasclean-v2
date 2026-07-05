import { NextResponse } from "next/server";
import { checkSameOrigin } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";
import {
  getScheduledBetween,
  getBlocksBetween,
  insertReservation,
  findLeadByContact,
  updateLead,
  markConfirmationSent,
} from "@/lib/db";
import {
  getFormula,
  computePrice,
  computeSlots,
  promoDiscount,
  type Interval,
} from "@/lib/booking";
import { VEHICLE_TYPES, AUTO_OPTIONS } from "@/lib/plans";
import { notifyNewLead } from "@/lib/notify";
import { sendReservationConfirmation } from "@/lib/reservationEmail";
import { sendTelegram, tgEscape } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}

export async function POST(req: Request) {
  if (!checkSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, {
    bucket: "reservation",
    maxAttempts: 12,
    windowMs: 60000,
    lockoutMs: 300000,
  });
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "Trop de tentatives" }, { status: 429 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const f = getFormula(String(b.formula || ""));
  const vehicle = VEHICLE_TYPES.find((v) => v.id === b.vehicle);
  const dateM = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(b.date || ""));
  const timeM = /^(\d{2}):(\d{2})$/.exec(String(b.time || ""));
  const firstName = str(b.firstName, 60);
  const phone = str(b.phone, 40);
  const email = str(b.email, 120);
  if (
    !f ||
    !vehicle ||
    !dateM ||
    !timeM ||
    !firstName ||
    !phone ||
    !email ||
    !/.+@.+\..+/.test(email)
  ) {
    return NextResponse.json(
      { ok: false, error: "Champs manquants (email requis)" },
      { status: 400 },
    );
  }

  const options = Array.isArray(b.options)
    ? ((b.options as unknown[]).filter(
        (o) => typeof o === "string" && AUTO_OPTIONS.some((x) => x.id === o),
      ) as string[])
    : [];
  const lastName = str(b.lastName, 60);
  const address = str(b.address, 200);
  const postalCode = str(b.postalCode, 10);
  const notes = str(b.notes, 1000);

  const dayStart = new Date(+dateM[1], +dateM[2] - 1, +dateM[3], 0, 0, 0, 0).getTime();
  const startMin = +timeM[1] * 60 + +timeM[2];
  const scheduled_at = dayStart + startMin * 60000;

  // Re-vérifie que le créneau est TOUJOURS libre (anti double-réservation).
  const dayEnd = dayStart + 86400000;
  const busy: Interval[] = [
    ...getScheduledBetween(dayStart, dayEnd).map((j) => {
      const s = Math.round((j.scheduled_at - dayStart) / 60000);
      return { start: s, end: s + (j.duration_min ?? 90) };
    }),
    ...getBlocksBetween(dayStart, dayEnd).map((bl) => ({
      start: Math.max(0, Math.round((bl.start_at - dayStart) / 60000)),
      end: Math.min(1440, Math.round((bl.end_at - dayStart) / 60000)),
    })),
  ];
  if (!computeSlots(dayStart, f.durationMin, busy, Date.now()).includes(`${timeM[1]}:${timeM[2]}`)) {
    return NextResponse.json(
      { ok: false, error: "Ce créneau vient d'être pris. Choisissez-en un autre." },
      { status: 409 },
    );
  }

  const basePrice = computePrice(f.id, vehicle.id, options);
  // Code promo — remise recalculée côté serveur (jamais confiance au client).
  const promo = str(b.promo, 40);
  const discount = promoDiscount(promo);
  const total = Math.max(0, basePrice - discount);
  const promoLabel = discount > 0 ? `Code promo ${promo!.toUpperCase()} (−${discount} €)` : "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const optionLabels = options
    .map((o) => AUTO_OPTIONS.find((x) => x.id === o)?.label)
    .filter(Boolean)
    .join(", ");

  // Auto-conversion d'un prospect existant (email ou téléphone).
  const lead = findLeadByContact(email, phone);
  if (lead) updateLead(lead.id, { status: "converti" });

  const resNotes =
    [notes, optionLabels ? `Options : ${optionLabels}` : "", promoLabel]
      .filter(Boolean)
      .join(" · ") || null;

  const id = insertReservation({
    ts: dayStart,
    scheduled_at,
    duration_min: f.durationMin,
    prestation: f.name,
    vehicle_type: vehicle.label,
    price: basePrice,
    total,
    phone,
    customer_name: fullName,
    email,
    address,
    postal_code: postalCode,
    notes: resNotes,
    source: "Réservation en ligne",
    lead_id: lead?.id ?? null,
  });
  // La confirmation est envoyée ci-dessous → marqué pour éviter un doublon si
  // l'équipe édite ce RDV depuis /equipe.
  markConfirmationSent(id);

  const when = new Date(scheduled_at).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Message Telegram équipe (best-effort).
  const tgMsg = [
    "📅 <b>Nouvelle réservation en ligne</b>",
    `👤 <b>${tgEscape(fullName || firstName)}</b>`,
    phone
      ? `📞 <a href="tel:${tgEscape(phone.replace(/[^\d+]/g, ""))}">${tgEscape(phone)}</a>`
      : "",
    email ? `✉️ ${tgEscape(email)}` : "",
    `🧽 ${tgEscape(`${f.name} · ${vehicle.label}`)}`,
    optionLabels ? `➕ ${tgEscape(optionLabels)}` : "",
    `🗓️ ${tgEscape(when)}`,
    address ? `📍 ${tgEscape([address, postalCode].filter(Boolean).join(", "))}` : "",
    `💶 <b>${total} €</b> (sur place)${discount > 0 ? ` — ${tgEscape(promoLabel)}` : ""}`,
    notes ? `📝 ${tgEscape(notes)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Notif équipe + confirmation client (jamais bloquant).
  await Promise.allSettled([
    sendTelegram(tgMsg),
    notifyNewLead({
      id,
      ts: scheduled_at,
      section: "auto",
      service_slug: f.id,
      service_label: `${f.name} (${vehicle.label})`,
      variant: optionLabels || null,
      first_name: fullName || firstName,
      email: email || "",
      phone,
      postal_code: postalCode,
      address_note: address,
      preferred_day: null,
      preferred_slot: `RDV ${when}`,
      notes: resNotes,
      ip: null,
      user_agent: null,
    }),
    sendReservationConfirmation({
      id,
      email,
      prenom: firstName,
      service: `${f.name} · ${vehicle.label}`,
      when,
      price: total,
      address,
    }),
  ]);

  return NextResponse.json({ ok: true, id, scheduled_at, price: total, converted: !!lead });
}
