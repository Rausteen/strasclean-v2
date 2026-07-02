import "server-only";
import crypto from "crypto";
import { SITE } from "./site";

// Emails liés aux réservations (confirmation + rappel J-1) — même expéditeur
// et même identité visuelle que les relances (RELANCE_EMAIL_FROM = bonjour@…).

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RELANCE_EMAIL_FROM ||
  process.env.LEAD_NOTIFY_FROM ||
  "StrasClean <onboarding@resend.dev>";
const SECRET = process.env.SESSION_SECRET || "strasclean-resa-fallback";

// ── Jeton signé de gestion de réservation (annuler / reporter) ──
export function resaToken(id: number): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`resa:${id}`)
    .digest("hex")
    .slice(0, 24);
}
export function checkResaToken(id: number, t: string): boolean {
  const exp = resaToken(id);
  const a = Buffer.from(t);
  const b = Buffer.from(exp);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export function resaManageUrl(id: number): string {
  return `${SITE.url}/reservation/${id}?t=${resaToken(id)}`;
}

export type ResaInfo = {
  id: number;
  email: string;
  prenom: string;
  service: string;
  when: string;
  price: number;
  address: string | null;
};

function recap(r: ResaInfo): string {
  const row = (k: string, v: string, strong = false) =>
    `<tr><td style="padding:7px 0;color:#6C7262">${k}</td><td style="padding:7px 0;text-align:right;${strong ? "font-weight:700" : "font-weight:600"}">${v}</td></tr>`;
  return `<table style="width:100%;border-collapse:collapse;margin:4px 0 4px">
    ${row("Prestation", r.service)}
    ${row("Date &amp; heure", r.when)}
    ${r.address ? row("Adresse", r.address) : ""}
    ${row("À régler sur place", `${r.price} €`, true)}
  </table>`;
}

function card(heading: string, bodyHtml: string, cta: string, ctaUrl: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f2">
  <div style="max-width:520px;margin:0 auto;padding:24px 16px;font:15px/1.6 -apple-system,system-ui,'Segoe UI',sans-serif;color:#15190F">
    <div style="text-align:center;margin-bottom:16px"><span style="font-size:20px;font-weight:800;letter-spacing:-.02em">Stras<span style="color:#10B981">Clean</span></span></div>
    <div style="background:#fff;border:1px solid #e7e5df;border-radius:20px;padding:26px 24px">
      <h1 style="margin:0 0 12px;font-size:21px;line-height:1.25">${heading}</h1>
      ${bodyHtml}
      <div style="text-align:center;margin:22px 0 4px">
        <a href="${ctaUrl}" style="display:inline-block;background:#10B981;color:#062b1e;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:999px">${cta}</a>
      </div>
      <p style="text-align:center;margin:16px 0 0;font-size:13px">
        <a href="${SITE.instagram}" style="color:#10B981;text-decoration:none;font-weight:600">Instagram</a>
        &nbsp;·&nbsp;
        <a href="${SITE.facebook}" style="color:#10B981;text-decoration:none;font-weight:600">Facebook</a>
        &nbsp;·&nbsp;
        <a href="${SITE.tiktok}" style="color:#10B981;text-decoration:none;font-weight:600">TikTok</a>
      </p>
    </div>
    <p style="text-align:center;color:#9aa08f;font-size:12px;margin:16px 0 0">StrasClean — nettoyage auto à domicile à Strasbourg · <a href="${SITE.url}" style="color:#9aa08f">strasclean.fr</a></p>
  </div></body></html>`;
}

async function send(to: string, subject: string, html: string, text: string): Promise<void> {
  if (!RESEND_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text, reply_to: SITE.email }),
    });
  } catch {
    /* best-effort */
  }
}

export async function sendReservationConfirmation(r: ResaInfo): Promise<void> {
  const manage = resaManageUrl(r.id);
  const body =
    `<p style="margin:0 0 14px;color:#3f463a">Merci ${r.prenom} ! On vient s'occuper de votre voiture à domicile. Voici le récap :</p>` +
    recap(r) +
    `<p style="margin:14px 0 0;color:#6C7262;font-size:13px">Besoin de changer ? Gérez votre rendez-vous ci-dessous (annuler / reporter).</p>`;
  const text = `Réservation confirmée !\n${r.service}\n${r.when}\n${r.price} € (sur place)\n\nGérer : ${manage}\nStrasClean · ${SITE.url}`;
  await send(r.email, `Réservation confirmée — ${r.when} ✅`, card("Réservation confirmée ✅", body, "Gérer ma réservation", manage), text);
}

export async function sendReservationReminder(r: ResaInfo): Promise<void> {
  const manage = resaManageUrl(r.id);
  const body =
    `<p style="margin:0 0 14px;color:#3f463a">Bonjour ${r.prenom}, petit rappel de votre rendez-vous StrasClean :</p>` +
    recap(r) +
    `<p style="margin:14px 0 0;color:#6C7262;font-size:13px">On sera là à l'heure 🙂 Un imprévu ? Vous pouvez reporter ou annuler.</p>`;
  const text = `Rappel — votre nettoyage ${r.when}\n${r.service}\n${r.price} € (sur place)\n\nGérer : ${manage}\nStrasClean · ${SITE.url}`;
  await send(r.email, `Rappel — votre nettoyage ${r.when} ⏰`, card("C'est pour bientôt ⏰", body, "Reporter / annuler", manage), text);
}
