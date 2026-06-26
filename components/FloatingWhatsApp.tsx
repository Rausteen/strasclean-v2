"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";
import { WhatsAppIcon, PhoneIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

export default function FloatingWhatsApp() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);

  useEffect(() => {
    // Apparaît quand le hero (#top) a entièrement quitté l'écran → plus de
    // doublon avec les CTA du hero (qui portent déjà WhatsApp + le formulaire),
    // et pas de "trou" : tant que le hero est visible, ses CTA prennent le
    // relais. Plus fiable qu'un seuil px fixe (hero de hauteur variable).
    const hero = document.getElementById("top");
    if (hero && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(hero);
      return () => io.disconnect();
    }
    // Repli (pages sans hero #top) : seuil de scroll généreux.
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Message contextualisé selon la section
  const waHref = isMaison
    ? waLink(
        "Bonjour StrasClean 👋 Je voudrais un devis pour un nettoyage à domicile (canapé / tapis / matelas / fauteuils). Quels sont vos prochains créneaux ?",
      )
    : SITE.whatsappHref;

  // Formulaire de réservation de la bonne section (3e canal d'acquisition).
  const reserveHref = isMaison ? "/reserver-maison" : "/reserver-auto";

  return (
    <>
      {/* Mobile sticky bar — n'apparaît qu'après scroll au-delà du hero */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white transition-all duration-300 lg:hidden ${
          scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
        style={{
          paddingTop: "10px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
          paddingLeft: "max(env(safe-area-inset-left, 0px), 12px)",
          paddingRight: "max(env(safe-area-inset-right, 0px), 12px)",
        }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa h-12 flex-1 text-[15px] font-semibold active:scale-[0.98]"
          >
            <WhatsAppIcon size={20} /> WhatsApp
          </a>
          <Link
            href={reserveHref}
            className="flex h-12 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-900 active:scale-[0.98]"
          >
            Devis
          </Link>
          <a
            href={SITE.phoneHref}
            aria-label="Appeler StrasClean"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-900 active:scale-95"
          >
            <PhoneIcon size={20} />
          </a>
        </div>
      </div>

      {/* Desktop floating button */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Réserver sur WhatsApp"
        className={`fixed bottom-6 right-6 z-40 hidden lg:inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-whatsapp-dark hover:scale-[1.03] ${
          scrolled ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <WhatsAppIcon size={20} />
        Réserver sur WhatsApp
      </a>
    </>
  );
}
