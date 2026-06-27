"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // Enregistre le service worker (scope /equipe → ne contrôle que l'app).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/equipe-sw.js", { scope: "/equipe" })
        .catch(() => {});
    }

    // Déjà installé / lancé en plein écran → ne rien proposer.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Android/Chrome : capte l'événement d'installation pour un bouton custom.
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari : pas d'événement → on affiche un mode d'emploi (1 fois).
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const dismissed = localStorage.getItem("equipe-ios-hint") === "1";
    if (isIos && !dismissed) setIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    setDeferred(null);
  }

  function dismissIos() {
    localStorage.setItem("equipe-ios-hint", "1");
    setIosHint(false);
  }

  // Android : bouton d'installation natif.
  if (deferred) {
    return (
      <div className="bg-brand-600 px-4 py-3 text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            📲 Installer l'app sur votre téléphone
          </span>
          <button
            onClick={install}
            className="shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-700"
          >
            Installer
          </button>
        </div>
      </div>
    );
  }

  // iOS : mode d'emploi (pas d'install programmatique possible).
  if (iosHint) {
    return (
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-start justify-between gap-3">
          <p className="text-sm text-slate-700">
            📲 <strong>Installer l'app :</strong> appuyez sur{" "}
            <strong>Partager</strong> (⬆️) puis{" "}
            <strong>« Sur l'écran d'accueil »</strong>.
          </p>
          <button
            onClick={dismissIos}
            aria-label="Fermer"
            className="shrink-0 text-slate-400"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
