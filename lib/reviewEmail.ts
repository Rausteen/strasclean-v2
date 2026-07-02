import "server-only";
import { SITE } from "./site";
import { resaToken } from "./reservationEmail";
import type { Job } from "./db";

// Demande d'avis Google après un job terminé (+ relances douces).
// Même expéditeur / identité visuelle que les autres emails (bonjour@…).

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RELANCE_EMAIL_FROM ||
  process.env.LEAD_NOTIFY_FROM ||
  "StrasClean <onboarding@resend.dev>";

/** Jours après la fin du job pour chaque relance : J0, J+3, J+6. */
export const REVIEW_DAYS = [0, 3, 6];
export const REVIEW_GRACE = [1, 3, 4];

export function reviewUnsubUrl(id: number): string {
  return `${SITE.url}/api/reservation/review-unsub?id=${id}&t=${resaToken(id)}`;
}

function firstName(full: string | null): string {
  return full ? full.trim().split(/\s+/)[0] || "" : "";
}

function socialRow(): string {
  return `<p style="text-align:center;margin:14px 0 0;font-size:13px">
    <a href="${SITE.instagram}" style="color:#10B981;text-decoration:none;font-weight:600">Instagram</a>
    &nbsp;·&nbsp;
    <a href="${SITE.facebook}" style="color:#10B981;text-decoration:none;font-weight:600">Facebook</a>
    &nbsp;·&nbsp;
    <a href="${SITE.tiktok}" style="color:#10B981;text-decoration:none;font-weight:600">TikTok</a>
  </p>`;
}

function card(heading: string, bodyHtml: string, unsub: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f2">
  <div style="max-width:520px;margin:0 auto;padding:24px 16px;font:16px/1.6 -apple-system,system-ui,'Segoe UI',sans-serif;color:#15190F">
    <div style="text-align:center;margin-bottom:18px"><span style="font-size:20px;font-weight:800;letter-spacing:-.02em">Stras<span style="color:#10B981">Clean</span></span></div>
    <div style="background:#fff;border:1px solid #e7e5df;border-radius:20px;padding:28px 24px">
      <h1 style="margin:0 0 14px;font-size:21px;line-height:1.25">${heading}</h1>
      <div style="color:#3f463a">${bodyHtml}</div>
      <div style="text-align:center;margin:24px 0 4px">
        <a href="${SITE.googleReview}" style="display:inline-block;background:#10B981;color:#062b1e;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:16px">⭐ Laisser un avis Google</a>
      </div>
      <p style="text-align:center;margin:10px 0 0;color:#86857e;font-size:13px">Ça prend 30 secondes et ça nous aide énormément 🙏</p>
      ${socialRow()}
    </div>
    <p style="text-align:center;color:#9aa08f;font-size:12px;margin:18px 0 0">
      StrasClean — nettoyage auto à domicile à Strasbourg · <a href="${SITE.url}" style="color:#9aa08f">strasclean.fr</a><br>
      <a href="${unsub}" style="color:#9aa08f">Ne plus recevoir ces messages</a>
    </p>
  </div></body></html>`;
}

function content(step: number, prenom: string): { subject: string; heading: string; body: string } {
  const p = prenom ? ` ${prenom}` : "";
  if (step === 0)
    return {
      subject: `Alors${p}, cette voiture toute propre ? ⭐`,
      heading: `Merci de votre confiance${p} !`,
      body:
        `<p style="margin:0 0 14px">On espère que votre voiture vous plaît 🚗✨</p>` +
        `<p style="margin:0 0 4px">Si vous avez été satisfait·e, un petit avis Google nous aiderait vraiment à nous faire connaître autour de Strasbourg. Merci d'avance !</p>`,
    };
  if (step === 1)
    return {
      subject: `Un petit avis pour StrasClean${p} ? 🙏`,
      heading: `30 secondes pour nous aider ?`,
      body:
        `<p style="margin:0 0 14px">On sait que le temps file${p} ! Si votre nettoyage vous a plu, votre avis Google fait une vraie différence pour une petite équipe locale comme la nôtre.</p>` +
        `<p style="margin:0">Merci beaucoup 🙏</p>`,
    };
  return {
    subject: `Dernière petite demande${p} 🙂`,
    heading: `Votre avis compte pour nous`,
    body:
      `<p style="margin:0 0 14px">Promis, c'est le dernier message à ce sujet${p} 🙂 Si vous avez apprécié notre passage, un avis Google nous aiderait beaucoup. Sinon, dites-nous ce qu'on peut améliorer en répondant à cet email.</p>` +
      `<p style="margin:0">Merci pour votre confiance !</p>`,
  };
}

/** Envoie l'email d'avis de l'étape `step`. true si Resend accepte. */
export async function sendReviewRequest(job: Job, step: number): Promise<boolean> {
  if (!RESEND_KEY || !job.email) return false;
  const prenom = firstName(job.customer_name);
  const c = content(step, prenom);
  const unsub = reviewUnsubUrl(job.id);
  const html = card(c.heading, c.body, unsub);
  const text = `${c.heading}\n\n${c.body.replace(/<[^>]+>/g, "")}\n\nLaisser un avis : ${SITE.googleReview}\nInstagram : ${SITE.instagram}\nFacebook : ${SITE.facebook}\n\nNe plus recevoir : ${unsub}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [job.email],
        subject: c.subject,
        html,
        text,
        reply_to: SITE.email,
        headers: { "List-Unsubscribe": `<${unsub}>` },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
