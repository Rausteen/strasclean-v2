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
  CarIcon,
  HomeIcon,
} from "./Icon";
import LogoMark from "./LogoMark";
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
      {/* TOPBAR principale — logo / toggle / nav / CTA */}
      <div className="container-x flex h-16 items-center gap-3">
        <Link
          href={onMaison ? "/strasclean-maison" : "/"}
          aria-label={
            onMaison ? "StrasClean Maison — accueil" : "StrasClean — accueil"
          }
          className="shrink-0"
        >
          <span className="flex items-center gap-2">
            <LogoMark
              size={36}
              variant={onMaison ? "amber" : "brand"}
              className={onMaison ? "shadow-glow-amber rounded-xl" : "shadow-glow rounded-xl"}
            />
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

        {/* Toggle Auto/Maison — collé au logo, desktop uniquement.
            Sur mobile c'est dans le drawer (cf. plus bas) pour ne pas
            surcharger la topbar. */}
        <div className="hidden lg:block">
          <SectionToggle onMaison={onMaison} />
        </div>

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
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          {/* CTA PRINCIPAL : Réserver en ligne (desktop). Section-aware. */}
          <Link
            href={onMaison ? "/reserver-maison" : "/reserver"}
            className="btn-primary hidden h-11 px-5 text-sm font-bold lg:inline-flex"
          >
            Réserver en ligne
          </Link>
          {/* WhatsApp desktop (secondaire, contour) */}
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn hidden h-11 px-4 text-sm font-semibold border border-slate-300 bg-white text-slate-900 hover:border-slate-900 lg:inline-flex"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
          {/* CTA PRINCIPAL mobile : Réserver (pill compacte) */}
          <Link
            href={onMaison ? "/reserver-maison" : "/reserver"}
            className="btn-primary h-11 px-4 text-sm font-bold lg:hidden"
          >
            Réserver
          </Link>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 active:scale-95 lg:hidden"
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — overlay full-screen fixed.
          Couvre tout le viewport (peu importe la position de scroll),
          slide-in du haut. Évite le bug de sticky qui casse quand
          body.overflow=hidden sur certains navigateurs mobiles. */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-slate-100 transition-all duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Top bar du drawer : logo + bouton close */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <Link
            href={onMaison ? "/strasclean-maison" : "/"}
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2"
          >
            <LogoMark
              size={32}
              variant={onMaison ? "amber" : "brand"}
              className="rounded-lg"
            />
            <span className="h-display text-base font-bold text-slate-900">
              Stras
              <span className={onMaison ? "text-amber-600" : "text-brand-600"}>
                Clean
              </span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 active:scale-95"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Toggle Auto/Maison — en haut du drawer pour switcher de section */}
        <div className="flex justify-center border-b border-slate-200 bg-white py-3">
          <SectionToggle onMaison={onMaison} />
        </div>

        {/* Nav scrollable si liste longue */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="flex flex-col gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-semibold text-slate-800 transition active:scale-[0.98] active:bg-white"
                >
                  <span>{n.label}</span>
                  <span aria-hidden className="text-slate-400">→</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/qui-sommes-nous"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-semibold text-slate-800 transition active:scale-[0.98] active:bg-white"
              >
                <span>À propos</span>
                <span aria-hidden className="text-slate-400">→</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA fixé en bas */}
        <div
          className="border-t border-slate-200 bg-white px-4 pt-4"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          }}
        >
          <Link
            href={onMaison ? "/reserver-maison" : "/reserver"}
            onClick={() => setOpen(false)}
            className="btn-primary mb-2 h-12 w-full text-[15px] font-bold active:scale-[0.98]"
          >
            Réserver en ligne <span aria-hidden>→</span>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={SITE.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white text-[15px] font-semibold text-slate-900 active:scale-[0.98]"
            >
              <PhoneIcon size={16} /> Appeler
            </a>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa h-12 w-full text-[15px]"
            >
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionToggle({ onMaison }: { onMaison: boolean }) {
  return (
    <div
      role="tablist"
      aria-label="Section StrasClean"
      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100 p-1 text-[13px]"
    >
      <Link
        href="/"
        role="tab"
        aria-selected={!onMaison}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-bold transition-all ${
          !onMaison
            ? "bg-brand-500 text-[#062b1e] shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <CarIcon size={13} />
        Auto
      </Link>
      <Link
        href="/strasclean-maison"
        role="tab"
        aria-selected={onMaison}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-bold transition-all ${
          onMaison
            ? "bg-[#E0A100] text-[#2a1f00] shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <HomeIcon size={13} />
        Maison
      </Link>
    </div>
  );
}
