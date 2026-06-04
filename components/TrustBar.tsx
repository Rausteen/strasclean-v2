"use client";

import { usePathname } from "next/navigation";
import { CheckIcon, MapPinIcon, ShieldIcon, BoltIcon, SparklesIcon } from "./Icon";
import { isMaisonPathname } from "@/lib/section";

const items = [
  { icon: <MapPinIcon size={16} />, label: "Strasbourg & alentours" },
  { icon: <BoltIcon size={16} />, label: "Réservation rapide" },
  { icon: <SparklesIcon size={16} />, label: "Matériel professionnel" },
  { icon: <ShieldIcon size={16} />, label: "Service à domicile" },
  { icon: <CheckIcon size={16} />, label: "Devis gratuit" },
];

export default function TrustBar() {
  const pathname = usePathname() || "/";
  const isMaison = isMaisonPathname(pathname);
  const iconColor = isMaison ? "text-amber-600" : "text-brand-600";

  return (
    <div className="border-y border-slate-100 bg-slate-50">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm text-slate-600">
        {items.map((it) => (
          <span key={it.label} className="inline-flex items-center gap-2">
            <span className={iconColor}>{it.icon}</span>
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}
