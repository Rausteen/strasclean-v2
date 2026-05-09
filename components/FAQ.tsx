"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { ChevronDownIcon, WhatsAppIcon } from "./Icon";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "Est-ce que vous vous déplacez à domicile ?",
    a: "Oui, c'est même le cœur de notre service. On intervient à votre domicile, sur votre lieu de travail ou à l'adresse de votre choix, à Strasbourg et dans les communes voisines.",
  },
  {
    q: "Combien de temps dure un nettoyage ?",
    a: "Comptez environ 1h à 1h30 pour la formule Confort, 2h à 3h pour la Premium, et jusqu'à 4h pour la Luxury Detailing. La durée dépend de la taille du véhicule et de son état.",
  },
  {
    q: "Le prix peut-il changer ?",
    a: "Les prix sont indiqués « à partir de » et peuvent varier selon la taille de la voiture (citadine, berline, SUV, utilitaire), l'état intérieur et les options demandées. On confirme toujours le tarif avant intervention.",
  },
  {
    q: "Dois-je fournir l'eau ou l'électricité ?",
    a: "Selon la formule et le lieu d'intervention, nous vous confirmerons les besoins exacts lors de la réservation. Pour la plupart des prestations à domicile, un simple accès à une prise électrique suffit.",
  },
  {
    q: "Nettoyez-vous les poils d'animaux ?",
    a: "Oui. Le traitement poils d'animaux est inclus dans la formule Luxury Detailing, et disponible en option sur les autres formules. On utilise un matériel adapté pour vraiment décoller les poils des tissus.",
  },
  {
    q: "Faites-vous le lavage extérieur ?",
    a: "Oui. Le lavage extérieur à la main, la décontamination de la carrosserie et le nettoyage des vitres extérieures sont inclus dans la formule Luxury Detailing.",
  },
  {
    q: "Comment réserver ?",
    a: "Le plus simple : envoyez-nous un message WhatsApp avec votre ville et idéalement une photo de votre véhicule. On vous confirme un créneau et la formule adaptée. Vous pouvez aussi nous appeler.",
  },
  {
    q: "Intervenez-vous en dehors de Strasbourg ?",
    a: "Oui. On couvre Schiltigheim, Illkirch, Bischheim, Ostwald, Lingolsheim, Hoenheim, Eckbolsheim, Oberhausbergen, Mundolsheim, Vendenheim, La Wantzenau, et les alentours. Si votre commune n'est pas listée, demandez-nous.",
  },
  {
    q: "Puis-je envoyer des photos avant de réserver ?",
    a: "Bien sûr, on encourage même cette démarche. Quelques photos de l'intérieur (sièges, moquette, coffre) nous permettent de vous conseiller la formule la plus adaptée et d'être précis sur le tarif.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Espèces, carte bancaire et virement. Le paiement se fait sur place, à la fin de la prestation, une fois que le résultat vous convient.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
              FAQ
            </p>
            <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Vos questions, nos réponses.
            </h2>
            <p className="mt-4 text-white/70">
              Une question qui n'est pas listée ? Écrivez-nous directement,
              on répond rapidement.
            </p>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-6"
            >
              <WhatsAppIcon size={18} /> Poser ma question sur WhatsApp
            </a>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <ul className="space-y-3">
              {FAQS.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
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
            open ? "rotate-180 text-brand-400" : "text-white/70"
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
