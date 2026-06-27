import type { Metadata, Viewport } from "next";
import { isTeamAuthenticated } from "@/lib/auth";
import { listJobs } from "@/lib/db";
import JobsApp from "./JobsApp";
import LoginForm from "./LoginForm";
import InstallPrompt from "./InstallPrompt";

// App interne de l'équipe (carnet de jobs). Jamais indexée.
// Manifest + icônes DÉDIÉS → installable comme une vraie app (écran d'accueil),
// pointant sur /equipe (≠ manifest du site marketing).
export const metadata: Metadata = {
  title: "Équipe — StrasClean",
  robots: { index: false, follow: false },
  manifest: "/equipe-manifest.webmanifest",
  appleWebApp: { capable: true, title: "Équipe", statusBarStyle: "default" },
  icons: {
    icon: "/equipe-icon-192.png",
    apple: "/equipe-icon-180.png",
  },
  // Balise Apple historique (plein écran sur iOS plus anciens). Next n'émet
  // que la version standardisée "mobile-web-app-capable", on ajoute l'autre.
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: "#10B981",
};

// Lit cookies + base à chaque requête.
export const dynamic = "force-dynamic";

export default async function EquipePage() {
  const authed = await isTeamAuthenticated();
  return (
    <>
      <InstallPrompt />
      {authed ? <JobsApp initialJobs={listJobs()} /> : <LoginForm />}
    </>
  );
}
