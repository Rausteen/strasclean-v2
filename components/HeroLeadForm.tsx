"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { AUTO_QUICK_SERVICES } from "@/lib/plans";
import { CheckIcon, ClockIcon, ArrowRightIcon, WhatsAppIcon } from "./Icon";

// Formulaire rapide du hero (accueil Auto) : capture d'intention en 4 champs
// (prénom, téléphone, email facultatif, service). Poste sur le même backend
// que la réservation complète : /api/booking-request (section "auto").
export default function HeroLeadForm() {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const phoneDigits = (v: string) => v.replace(/[^0-9]/g, "").length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) return setError("Indiquez votre prénom.");
    if (phoneDigits(phone) < 8) return setError("Numéro de téléphone invalide.");
    if (!email.trim()) return setError("Indiquez votre email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Email invalide.");
    }
    if (!service) return setError("Choisissez un service.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "auto",
          itemId: service,
          firstName: firstName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }
      // Conversion (GA4 / Google Ads / Meta) — cf. Analytics.tsx
      if (typeof window !== "undefined" && typeof window.scConvert === "function") {
        window.scConvert("form", "auto");
      }
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur réseau. Réessayez ou contactez-nous par WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-card sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white">
          <CheckIcon size={24} />
        </div>
        <h2 className="h-display mt-4 text-xl font-bold text-slate-900">
          Merci {firstName.trim()} — c'est noté !
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          On vous rappelle (ou WhatsApp) sous <strong>1 h ouvrée</strong> pour
          confirmer votre créneau et le devis.
        </p>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa mt-5 h-12 w-full px-6 text-base"
        >
          <WhatsAppIcon size={18} /> Suivre sur WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-center gap-2 text-sm font-bold text-brand-700">
        <ClockIcon size={15} />
        Demande en 1 minute
      </div>
      <h2 className="h-display mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
        Recevez votre créneau
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Laissez vos coordonnées, on vous rappelle pour confirmer votre créneau.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
          autoComplete="given-name"
          autoCapitalize="words"
          aria-label="Prénom"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
        />
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone"
          required
          autoComplete="tel"
          aria-label="Téléphone"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
        />
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
          aria-label="Email"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
        />
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
          aria-label="Service souhaité"
          className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20 ${
            service ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <option value="" disabled>
            Service souhaité
          </option>
          {AUTO_QUICK_SERVICES.map((s) => (
            <option key={s.id} value={s.id} className="text-slate-900">
              {s.label}
            </option>
          ))}
        </select>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary h-12 w-full text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Envoi…" : "Demander mon créneau"}
          {!submitting && <ArrowRightIcon size={16} />}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon size={13} className="text-brand-600" />
          Réponse sous 1 h ouvrée (~15 min en moy.)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckIcon size={13} className="text-brand-600" />
          Sans engagement
        </span>
      </div>
    </div>
  );
}
