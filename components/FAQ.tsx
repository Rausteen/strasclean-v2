"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { ChevronDownIcon, WhatsAppIcon } from "./Icon";
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
  const accentText = isMaison ? "text-amber-300" : "text-brand-400";
  const accentRotate = isMaison ? "text-amber-300" : "text-brand-400";
  const waMessage = isMaison
    ? "Bonjour StrasClean 👋 J'ai une question sur le nettoyage à domicile (canapé / tapis / matelas). Pouvez-vous me répondre ?"
    : "Bonjour StrasClean 👋 J'ai une question sur le nettoyage auto. Pouvez-vous me répondre ?";
  const waHref = isMaison ? waLink(waMessage) : SITE.whatsappHref;

  return (
    <section id="faq" className="relative py-14 sm:py-24 lg:py-28">
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
              className={`text-sm font-semibold uppercase tracking-[0.18em] ${accentText}`}
            >
              FAQ
            </p>
            <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Vos questions, nos réponses.
            </h2>
            <p className="mt-4 text-white/70">
              Une question qui n'est pas listée ? Écrivez-nous directement, on
              répond rapidement.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-6"
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
                  defaultOpen={i === 0}
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
  defaultOpen,
  openColor,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
  openColor: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <li className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-white/90 transition hover:bg-white/[0.04]"
      >
        <span>{q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition ${
            open ? `rotate-180 ${openColor}` : "text-white/70"
          }`}
        >
          <ChevronDownIcon size={16} />
        </span>
      </button>
      <div
        className={`grid overflow-hidden px-5 transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <p className="text-sm leading-relaxed text-white/70">{a}</p>
        </div>
      </div>
    </li>
  );
}
