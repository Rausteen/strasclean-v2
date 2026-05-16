"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import {
  WhatsAppIcon,
  PhoneIcon,
  MenuIcon,
  CloseIcon,
  SparklesIcon,
  CarIcon,
  HomeIcon,
} from "./Icon";
import { isMaisonPathname, NAV_AUTO, NAV_MAISON } from "@/lib/section";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const onMaison = isMaisonPathname(pathname);

  // NAV anchors selon section
  const nav = onMaison ? NAV_MAISON : NAV_AUTO;

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
        scrolled
          ? "border-b border-white/5 bg-ink-950/95 lg:bg-ink-950/80 lg:backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* TOPBAR principale — logo / nav / CTA */}
      <div className="container-x flex h-16 items-center gap-3">
        {/* Logo — pointe vers le hub de la section courante (Auto ou Maison)
            pour ne pas faire basculer l'utilisateur d'un univers à l'autre
            par accident. */}
        <Link
          href={onMaison ? "/strasclean-maison" : "/"}
          aria-label={
            onMaison ? "StrasClean Maison — accueil" : "StrasClean — accueil"
          }
          className="shrink-0"
        >
          <span className="flex items-center gap-2">
            <span
              className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${
                onMaison
                  ? "from-amber-300 to-amber-500 shadow-glow-amber"
                  : "from-brand-400 to-brand-600 shadow-glow"
              }`}
            >
              <SparklesIcon size={18} className="text-ink-950" />
            </span>
            <span className="h-display text-lg font-bold tracking-tight text-white">
              Stras
              <span className={onMaison ? "text-amber-400" : "text-brand-400"}>
                Clean
              </span>
              {onMaison && (
                <span className="ml-1 hidden text-[10px] font-medium uppercase tracking-wider text-amber-300/80 sm:inline">
                  Maison
                </span>
              )}
            </span>
          </span>
        </Link>

        {/* NAV anchors centrales (desktop uniquement) */}
        <nav className="mx-auto hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-white/65 transition hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA WhatsApp + Burger mobile */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* WhatsApp desktop */}
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa hidden lg:inline-flex"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
          {/* WhatsApp mobile (texte plus court) */}
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa !min-h-0 !px-3 !py-2 text-sm lg:hidden"
            aria-label="Réserver sur WhatsApp"
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>
          {/* Burger menu mobile */}
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white active:scale-95 lg:hidden"
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* SOUS-STRIP — pill Auto/Maison toujours visible, position stable */}
      <div className="border-t border-white/5 bg-ink-950/60 backdrop-blur-sm">
        <div className="container-x flex h-10 items-center justify-center">
          <SectionToggle onMaison={onMaison} />
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div className="border-t border-white/5 bg-ink-950">
            <div className="container-x flex flex-col gap-3 py-4">
              {/* NAV section courante */}
              <div className="flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-base font-medium text-white/85 hover:bg-white/5"
                  >
                    {n.label}
                  </Link>
                ))}
              </div>

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

function SectionToggle({ onMaison }: { onMaison: boolean }) {
  return (
    <div
      role="tablist"
      aria-label="Section StrasClean"
      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-xs"
    >
      <Link
        href="/"
        role="tab"
        aria-selected={!onMaison}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition ${
          !onMaison
            ? "bg-brand-500 text-ink-950 shadow"
            : "text-white/70 hover:text-white"
        }`}
      >
        <CarIcon size={13} />
        Auto
      </Link>
      <Link
        href="/strasclean-maison"
        role="tab"
        aria-selected={onMaison}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition ${
          onMaison
            ? "bg-amber-400 text-ink-950 shadow"
            : "text-white/70 hover:text-white"
        }`}
      >
        <HomeIcon size={13} />
        Maison
      </Link>
    </div>
  );
}
