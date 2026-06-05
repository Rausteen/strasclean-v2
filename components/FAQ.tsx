"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { WhatsAppIcon } from "./Icon";
import { SITE, waLink } from "@/lib/site";
import { FAQS, FAQItem, faqJsonLd } from "@/lib/faq";

type Props = {
  /** Liste affichée dans l'accordéon + JSON-LD. Défaut : FAQ globale auto. */
  mainFAQs?: FAQItem[];
  /** Q&R supplémentaires fusionnées dans le FAQPage JSON-LD (non affichées). */
  extraSchemaFAQs?: FAQItem[];
  /** Thème visuel + URL WhatsApp générée */
  variant?: "auto" | "maison";
};

export default function FAQ({
  mainFAQs,
  extraSchemaFAQs,
  variant = "auto",
}: Props = {}) {
  const list = mainFAQs ?? FAQS;
  const allForSchema = [...list, ...(extraSchemaFAQs ?? [])];

  const isMaison = variant === "maison";
  const accentText = isMaison ? "text-amber-600" : "text-brand-700";
  const beforeBg = isMaison ? "before:bg-amber-500" : "before:bg-brand-500";
  const accentRotate = isMaison ? "text-amber-600" : "text-brand-700";
  const waMessage = isMaison
    ? "Bonjour StrasClean 👋 J'ai une question sur le nettoyage à domicile (canapé / tapis / matelas). Pouvez-vous me répondre ?"
    : "Bonjour StrasClean 👋 J'ai une question sur le nettoyage auto. Pouvez-vous me répondre ?";
  const waHref = isMaison ? waLink(waMessage) : SITE.whatsappHref;

  // Accordéon mono-ouvert : un seul item ouvert à la fois. Par défaut le
  // premier est ouvert (UX d'annonce de la section).
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(allForSchema)),
        }}
      />

      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p
              className={`inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.18em] ${accentText} ${beforeBg} before:h-px before:w-6 before:opacity-80 before:content-['']`}
            >
              FAQ
            </p>
            <h2 className="h-display mt-3.5 text-balance text-[clamp(26px,6vw,40px)] font-bold leading-[1.05] tracking-[-0.02em] text-slate-900">
              Vos questions, nos réponses.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[17px]">
              Une question qui n'est pas listée ? Écrivez-nous directement, on
              répond rapidement.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-6 h-12 px-6"
            >
              <WhatsAppIcon size={18} /> Poser ma question sur WhatsApp
            </a>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <ul className="space-y-3">
              {list.map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  openColor={accentRotate}
                />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
  openColor,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  openColor: string;
}) {
  return (
    <li className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15.5px] font-semibold text-slate-900 transition hover:bg-slate-50"
      >
        <span>{q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 transition duration-200 ${
            open ? `rotate-45 border-current bg-white ${openColor}` : "text-slate-600"
          }`}
          aria-hidden
        >
          {/* "+" qui pivote en "x" à l'ouverture */}
          <span className="relative h-3 w-3">
            <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current" />
          </span>
        </span>
      </button>
      <div
        className={`grid overflow-hidden px-5 transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <p className="text-[14.5px] leading-relaxed text-slate-700">{a}</p>
        </div>
      </div>
    </li>
  );
}
