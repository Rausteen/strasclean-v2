"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { WhatsAppIcon, PhoneIcon } from "./Icon";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile sticky bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-ink-950/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-md gap-2">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa flex-1 h-12 text-base"
          >
            <WhatsAppIcon size={20} /> Réserver sur WhatsApp
          </a>
          <a
            href={SITE.phoneHref}
            aria-label="Appeler StrasClean"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white"
          >
            <PhoneIcon size={18} />
          </a>
        </div>
      </div>

      {/* Desktop floating button */}
      <a
        href={SITE.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Réserver sur WhatsApp"
        className={`fixed bottom-6 right-6 z-40 hidden lg:inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-whatsapp-dark hover:scale-[1.03] ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
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
