import "server-only";
import type { BookingRequest } from "./db";
import { SITE } from "./site";

/**
 * Notification email à chaque nouveau lead (formulaire de réservation).
 *
 * Implémentation volontairement SANS dépendance : on appelle l'API HTTP de
 * Resend (https://resend.com) avec `fetch`. C'est activé UNIQUEMENT si la
 * variable d'env `RESEND_API_KEY` est définie — sinon la fonction est un
 * no-op (aucun envoi, aucune erreur), pour ne jamais bloquer la prod.
 *
 * Variables d'env :
 *   RESEND_API_KEY    (obligatoire pour activer)  — clé API Resend
 *   LEAD_NOTIFY_TO    (défaut: SITE.email)        — destinataire(s), séparés par des virgules
 *   LEAD_NOTIFY_FROM  (défaut: onboarding@resend.dev) — expéditeur (domaine vérifié en prod)
 *
 * La fonction n'émet JAMAIS d'exception : toute erreur est loggée et avalée,
 * pour que l'échec d'un email ne fasse jamais échouer l'enregistrement du lead.
 */
type LeadInput = Omit<BookingRequest, "id" | "status"> & { id: number };

function esc(s: string | null | undefined): string {
  if (!s) return "—";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function notifyNewLead(lead: LeadInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // notification désactivée tant que non configurée

  const to = (process.env.LEAD_NOTIFY_TO || SITE.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from =
    process.env.LEAD_NOTIFY_FROM || "StrasClean <onboarding@resend.dev>";

  const sectionLabel = lead.section === "maison" ? "Maison" : "Auto";
  const when = new Date(lead.ts).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
  });
  const telDigits = lead.phone.replace(/[^0-9+]/g, "");

  const subject = `🟢 Nouveau lead ${sectionLabel} — ${lead.first_name} · ${lead.service_label}`;

  const rows: [string, string | null][] = [
    ["Prestation", `${lead.service_label} (${sectionLabel})`],
    ["Détail", lead.variant],
    ["Prénom", lead.first_name],
    ["Téléphone", lead.phone],
    ["Email", lead.email],
    ["Code postal", lead.postal_code],
    ["Adresse / précisions", lead.address_note],
    ["Jour souhaité", lead.preferred_day],
    ["Créneau souhaité", lead.preferred_slot],
    ["Message", lead.notes],
    ["Reçu le", when],
  ];

  const text =
    `Nouveau lead ${sectionLabel} (#${lead.id})\n\n` +
    rows.map(([k, v]) => `${k}: ${v ?? "—"}`).join("\n") +
    `\n\nRappeler : ${lead.phone}\nRépondre : ${lead.email}`;

  const html = `
    <div style="font:15px/1.5 system-ui,sans-serif;color:#15190F;max-width:560px">
      <h2 style="margin:0 0 4px">🟢 Nouveau lead ${esc(sectionLabel)} <span style="color:#86857e">#${lead.id}</span></h2>
      <p style="margin:0 0 16px;color:#6C7262">Rappelle vite — la vitesse de réponse fait le taux de transformation.</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:6px 10px;border-bottom:1px solid #E2DECF;color:#6C7262;white-space:nowrap;vertical-align:top">${esc(k)}</td>
                 <td style="padding:6px 10px;border-bottom:1px solid #E2DECF;font-weight:600">${esc(v)}</td>
               </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:18px 0 0">
        <a href="tel:${esc(telDigits)}" style="display:inline-block;background:#10B981;color:#062b1e;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:999px">📞 Rappeler ${esc(lead.first_name)}</a>
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        reply_to: lead.email, // répondre = écrire directement au client
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[notify] Resend a renvoyé ${res.status}: ${detail}`);
    }
  } catch (err) {
    console.error("[notify] échec envoi email lead", err);
  }
}
