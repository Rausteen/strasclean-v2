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

const NAV_AUTO = [
  { href: "#formules", label: "Formules" },
  { href: "#avant-apres", label: "Avant / Après" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#avis", label: "Avis" },
  { href: "#faq", label: "FAQ" },
];

const HOME_SLUGS = [
  "nettoyage-canape-strasbourg",
  "nettoyage-tapis-domicile-strasbourg",
  "nettoyage-matelas-strasbourg",
  "nettoyage-fauteuil-chaise-strasbourg",
];

function isMaisonPath(pathname: string): boolean {
  if (pathname === "/strasclean-maison" || pathname === "/maison") return true;
  return HOME_SLUGS.some((s) => pathname === `/${s}`);
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const onMaison = isMaisonPath(pathname);

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
      <div className="container-x flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="StrasClean accueil"
          className="group flex shrink-0 items-center gap-2"
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br shadow-glow ${
              onMaison ? "from-amber-300 to-amber-500" : "from-brand-400 to-brand-600"
            }`}
          >
            <SparklesIcon size={18} className="text-ink-950" />
          </span>
          <span className="h-display text-lg font-bold tracking-tight text-white">
            Stras
            <span className={onMaison ? "text-amber-400" : "text-brand-400"}>
              Clean
            </span>
          </span>
        </Link>

        {/* Toggle Auto / Maison — au centre desktop */}
        <div className="hidden flex-1 justify-center lg:flex">
          <SectionToggle onMaison={onMaison} />
        </div>

        {/* NAV ancres (auto uniquement) — discret */}
        {!onMaison && (
          <nav className="hidden items-center gap-5 xl:flex">
            {NAV_AUTO.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-white/65 transition hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}

        {/* CTAs desktop */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
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
            WhatsApp
          </a>
        </div>

        {/* Mobile */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
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
          <div className="border-t border-white/5 bg-ink-950">
            <div className="container-x flex flex-col gap-3 py-4">
              {/* Toggle Auto / Maison mobile */}
              <SectionToggle onMaison={onMaison} onNavigate={() => setOpen(false)} />

              {/* NAV ancres si on est sur l'auto */}
              {!onMaison && (
                <div className="mt-1 flex flex-col gap-1">
                  {NAV_AUTO.map((n) => (
                    <a
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-base font-medium text-white/85 hover:bg-white/5"
                    >
                      {n.label}
                    </a>
                  ))}
                </div>
              )}

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

function SectionToggle({
  onMaison,
  onNavigate,
}: {
  onMaison: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm">
      <Link
        href="/"
        onClick={onNavigate}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${
          !onMaison
            ? "bg-brand-500 text-ink-950 shadow"
            : "text-white/70 hover:text-white"
        }`}
      >
        <CarIcon size={14} />
        Auto
      </Link>
      <Link
        href="/strasclean-maison"
        onClick={onNavigate}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition ${
          onMaison
            ? "bg-amber-400 text-ink-950 shadow"
            : "text-white/70 hover:text-white"
        }`}
      >
        <HomeIcon size={14} />
        Maison
      </Link>
    </div>
  );
}
