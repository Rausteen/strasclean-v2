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

  // Ferme le drawer dès qu'on change de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-slate-100 bg-white/95 lg:bg-white/80 lg:backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* TOPBAR principale — logo / nav / CTA */}
      <div className="container-x flex h-16 items-center gap-3">
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
              <SparklesIcon size={18} className="text-slate-900" />
            </span>
            <span className="h-display text-lg font-bold tracking-tight text-slate-900">
              Stras
              <span className={onMaison ? "text-amber-600" : "text-brand-600"}>
                Clean
              </span>
              {onMaison && (
                <span className="ml-1 hidden text-[10px] font-medium uppercase tracking-wider text-amber-600/80 sm:inline">
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
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA WhatsApp (desktop) + Burger mobile. Sur mobile le bouton
            WhatsApp est retiré du Header pour ne pas surcharger : il y a
            déjà les CTA Hero et la sticky bar en bas qui prennent le
            relais après scroll. */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa hidden lg:inline-flex"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-900 active:scale-95 lg:hidden"
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* SOUS-STRIP — pill Auto/Maison toujours visible, position stable */}
      <div className="border-t border-slate-100 bg-white/60 backdrop-blur-sm">
        <div className="container-x flex h-10 items-center justify-center">
          <SectionToggle onMaison={onMaison} />
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div className="border-t border-slate-100 bg-white">
            <div className="container-x flex flex-col gap-3 py-4">
              <div className="flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50"
                  >
                    {n.label}
                  </Link>
                ))}
                {/* À propos — accessible depuis chaque page, hors NAV
                    section pour ne pas alourdir la nav desktop. */}
                <Link
                  href="/qui-sommes-nous"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50"
                >
                  À propos
                </Link>
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
      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 text-xs"
    >
      <Link
        href="/"
        role="tab"
        aria-selected={!onMaison}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold transition ${
          !onMaison
            ? "bg-brand-500 text-slate-900 shadow"
            : "text-slate-600 hover:text-slate-900"
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
            ? "bg-amber-400 text-slate-900 shadow"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <HomeIcon size={13} />
        Maison
      </Link>
    </div>
  );
}
