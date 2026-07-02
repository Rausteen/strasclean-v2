import "server-only";
import crypto from "crypto";
import { SITE, waLink } from "./site";
import type { Lead } from "./db";

// Séquence de relance des prospects (Resend), pilotée par le statut du lead
// (nouveau/a_relancer = on envoie ; converti/perdu = stop). J0 / J3 / J5 / J7.

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RELANCE_EMAIL_FROM ||
  process.env.LEAD_NOTIFY_FROM ||
  "StrasClean <onboarding@resend.dev>";
const SECRET = process.env.SESSION_SECRET || "strasclean-unsub-fallback";

/** Jours après réception pour chaque étape : 0=J0, 1=J3, 2=J5, 3=J7. */
export const DRIP_DAYS = [0, 3, 5, 7];
/** Fenêtre (jours) pendant laquelle une étape peut encore partir. Au-delà, on
 *  la saute (évite de spammer un vieux lead au 1er passage du cron). */
export const DRIP_GRACE_DAYS = [0.5, 2, 2, 3];

function firstName(full: string | null): string {
  return full ? full.trim().split(/\s+/)[0] || "" : "";
}

export function unsubToken(id: number): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`unsub:${id}`)
    .digest("hex")
    .slice(0, 24);
}
export function checkUnsub(id: number, token: string): boolean {
  const expected = unsubToken(id);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function unsubUrl(id: number): string {
  return `${SITE.url}/api/leads/unsubscribe?id=${id}&t=${unsubToken(id)}`;
}

type Step = { subject: string; heading: string; body: string; cta: string };

function stepContent(step: number, prenom: string): Step | null {
  const p = prenom ? ` ${prenom}` : "";
  const avis = `<p style="margin:0 0 16px;padding:13px 15px;background:#f4f5f2;border-radius:12px;font-style:italic;color:#3f463a">« Voiture impeccable, ponctuels et vraiment soigneux. Je recommande à 100 %. »<br><span style="font-style:normal;color:#86857e;font-size:13px">— un client StrasClean</span></p>`;

  if (step === 0)
    return {
      subject: `Merci${p} — votre voiture entre de bonnes mains 🚗`,
      heading: `Bien reçu${p}, merci ! 🚗`,
      body:
        `<p style="margin:0 0 14px">Votre demande est bien arrivée. Chez <b>StrasClean</b>, on vient laver et nettoyer votre voiture <b>directement chez vous</b> — intérieur et extérieur, à la main, avec des produits professionnels.</p>` +
        `<p style="margin:0 0 4px">Notre équipe vous rappelle très vite. Envie d'aller plus vite ? Réservez votre créneau en un message :</p>`,
      cta: "Réserver sur WhatsApp",
    };
  if (step === 1)
    return {
      subject: `${prenom ? prenom + ", v" : "V"}otre voiture mérite un coup de neuf ✨`,
      heading: `On redonne un coup de neuf à votre voiture ✨`,
      body:
        `<p style="margin:0 0 16px">Toujours partant${p} ? On s'occupe de tout, <b>sans que vous ayez à vous déplacer</b> : aspiration, sièges, plastiques, vitres, lavage extérieur… votre voiture ressort comme neuve.</p>` +
        avis +
        `<p style="margin:0">Devis gratuit, sans engagement :</p>`,
      cta: "Prendre mon créneau",
    };
  if (step === 2)
    return {
      subject: `Un créneau cette semaine près de chez vous ?`,
      heading: `On peut passer cette semaine${p}`,
      body:
        `<p style="margin:0 0 14px">Il nous reste quelques créneaux cette semaine dans votre secteur. Si votre voiture a besoin d'un coup de frais, c'est le bon moment 🙂</p>` +
        `<p style="margin:0">On vous répond en moins de 30 min, 7j/7 de 8h à 22h. On vous cale ça :</p>`,
      cta: "Voir les disponibilités",
    };
  return {
    subject: `On garde votre place${p} 🙂`,
    heading: `Toujours là quand vous voulez${p}`,
    body:
      `<p style="margin:0 0 14px">Pas encore trouvé le bon moment ? Pas de souci — on garde votre contact. Dès que votre voiture a besoin d'un nettoyage, on est à un simple message.</p>` +
      `<p style="margin:0">À très vite chez StrasClean :</p>`,
    cta: "Réserver quand je veux",
  };
}

function render(s: Step, ctaUrl: string, unsub: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f2">
  <div style="max-width:520px;margin:0 auto;padding:24px 16px;font:16px/1.6 -apple-system,system-ui,'Segoe UI',sans-serif;color:#15190F">
    <div style="text-align:center;margin-bottom:18px">
      <span style="font-size:20px;font-weight:800;letter-spacing:-.02em">Stras<span style="color:#10B981">Clean</span></span>
    </div>
    <div style="background:#fff;border:1px solid #e7e5df;border-radius:20px;padding:28px 24px">
      <h1 style="margin:0 0 14px;font-size:21px;line-height:1.25">${s.heading}</h1>
      <div style="color:#3f463a">${s.body}</div>
      <div style="text-align:center;margin:26px 0 8px">
        <a href="${ctaUrl}" style="display:inline-block;background:#10B981;color:#062b1e;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:16px">${s.cta}</a>
      </div>
      <p style="text-align:center;margin:12px 0 0;color:#86857e;font-size:13px">⭐ 5,0/5 sur Google · à domicile · 7j/7</p>
    </div>
    <p style="text-align:center;color:#9aa08f;font-size:12px;margin:18px 0 0">
      StrasClean — nettoyage auto à domicile à Strasbourg · <a href="${SITE.url}" style="color:#9aa08f">strasclean.fr</a><br>
      <a href="${unsub}" style="color:#9aa08f">Se désinscrire</a>
    </p>
  </div></body></html>`;
}

/** Envoie l'email de l'étape `step` au lead. Renvoie true si Resend accepte. */
export async function sendLeadEmail(lead: Lead, step: number): Promise<boolean> {
  if (!RESEND_KEY || !lead.email) return false;
  const prenom = firstName(lead.full_name);
  const s = stepContent(step, prenom);
  if (!s) return false;
  const wa = waLink(
    `Bonjour StrasClean 👋 ${prenom ? prenom + ", " : ""}je souhaite un nettoyage de ma voiture à domicile.`,
  );
  const unsub = unsubUrl(lead.id);
  const html = render(s, wa, unsub);
  const text =
    `${s.heading}\n\n${s.body.replace(/<[^>]+>/g, "").replace(/\n{2,}/g, "\n\n")}\n\n${s.cta} : ${wa}\n\n` +
    `StrasClean · ${SITE.url}\nSe désinscrire : ${unsub}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${RESEND_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [lead.email],
        subject: s.subject,
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
