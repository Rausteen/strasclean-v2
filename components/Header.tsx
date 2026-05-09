"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { WhatsAppIcon, PhoneIcon, MenuIcon, CloseIcon, SparklesIcon } from "./Icon";

const NAV = [
  { href: "#formules", label: "Formules" },
  { href: "#avant-apres", label: "Avant / Après" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#avis", label: "Avis" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink-950/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" aria-label="StrasClean accueil" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
            <SparklesIcon size={18} className="text-ink-950" />
          </span>
          <span className="h-display text-lg font-bold tracking-tight text-white">
            Stras<span className="text-brand-400">Clean</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={SITE.phoneHref} className="btn-ghost">
            <PhoneIcon size={16} />
            Appeler
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <WhatsAppIcon size={18} />
            Réserver sur WhatsApp
          </a>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa !min-h-0 !px-3.5 !py-2 text-sm"
            aria-label="Réserver sur WhatsApp"
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white active:scale-95"
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div className="border-t border-white/5 bg-ink-950/95 backdrop-blur">
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                >
                  {n.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a href={SITE.phoneHref} className="btn-ghost w-full">
                  <PhoneIcon size={16} /> Appeler
                </a>
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full"
                >
                  <WhatsAppIcon size={18} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
