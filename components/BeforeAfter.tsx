import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Reveal from "./Reveal";
import { SparklesIcon } from "./Icon";

// ─────────────────────────────────────────────────────────────────────────
//  BeforeAfter — bloc "avant/après" Auto.
//
//  Détecte automatiquement les vraies photos clients si elles existent dans
//  /public/avant-apres/, sinon affiche un placeholder gradient cohérent.
//
//  Fichiers attendus :
//   /public/avant-apres/siegeavant.webp + siegeapres.webp
//   /public/avant-apres/tapisavant.webp + tapisapres.webp
//   /public/avant-apres/tableauavant.webp + tableauapres.webp
//   /public/avant-apres/carrosserieavant.webp + carrosserieapres.webp
//
//  Si une photo manque (workflow d'upload sur VPS), le placeholder gradient
//  prend le relais — pas de broken image dans la page.
// ─────────────────────────────────────────────────────────────────────────

type Pair = {
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  gradient: string;
  /** Nom de fichier sans extension (cherché dans /public/avant-apres/) */
  imageStem: string;
};

const PAIRS: Pair[] = [
  {
    title: "Sièges & tissus",
    description: "Taches profondes, traces et zones marquées disparues.",
    beforeLabel: "Sièges tachés",
    afterLabel: "Sièges nettoyés",
    gradient: "from-amber-700/60 to-amber-900/60",
    imageStem: "siege",
  },
  {
    title: "Moquette & tapis",
    description: "Aspiration, shampouinage et désodorisation en profondeur.",
    beforeLabel: "Tapis sales",
    afterLabel: "Tapis propres",
    gradient: "from-stone-600/60 to-stone-900/60",
    imageStem: "tapis",
  },
  {
    title: "Tableau de bord",
    description: "Plastiques rénovés, vitres claires et points de contact désinfectés.",
    beforeLabel: "Tableau poussiéreux",
    afterLabel: "Intérieur propre",
    gradient: "from-slate-600/60 to-slate-900/60",
    imageStem: "tableau",
  },
  {
    title: "Carrosserie",
    description: "Lavage à la main, décontamination et finition brillante.",
    beforeLabel: "Extérieur terne",
    afterLabel: "Extérieur brillant",
    gradient: "from-blue-700/60 to-slate-900/60",
    imageStem: "carrosserie",
  },
];

const EXT_ORDER = ["webp", "jpg", "jpeg", "png"] as const;
const PHOTO_DIR = path.join(process.cwd(), "public", "avant-apres");

/** Cherche le fichier {stem}{suffix}.{ext} dans /public/avant-apres/. */
function findPhoto(stem: string, suffix: "avant" | "apres"): string | null {
  for (const ext of EXT_ORDER) {
    const filename = `${stem}${suffix}.${ext}`;
    const full = path.join(PHOTO_DIR, filename);
    if (fs.existsSync(full)) {
      return `/avant-apres/${filename}`;
    }
  }
  return null;
}

export default function BeforeAfter() {
  // Résolution au build/render : si l'image n'est pas dans /public/,
  // le placeholder gradient prend le relais (graceful degradation).
  const pairs = PAIRS.map((p) => ({
    ...p,
    beforeImage: findPhoto(p.imageStem, "avant"),
    afterImage: findPhoto(p.imageStem, "apres"),
  }));
  return (
    <section id="avant-apres" className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Avant / Après
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Des résultats visibles dès la première intervention.
          </h2>
          <p className="mt-4 text-slate-600">
            Chaque détail compte. On vous montre la différence sur les zones
            qui font le plus de différence dans votre habitacle.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {pairs.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <BeforeAfterCard pair={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type ResolvedPair = Pair & {
  beforeImage: string | null;
  afterImage: string | null;
};

function BeforeAfterCard({ pair }: { pair: ResolvedPair }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:border-slate-300">
      <div className="grid grid-cols-2 gap-px bg-slate-50">
        <Tile
          label={pair.beforeLabel}
          tone="before"
          gradient={pair.gradient}
          image={pair.beforeImage ?? undefined}
          alt={`${pair.title} — avant nettoyage StrasClean`}
        />
        <Tile
          label={pair.afterLabel}
          tone="after"
          gradient={pair.gradient}
          image={pair.afterImage ?? undefined}
          alt={`${pair.title} — après nettoyage StrasClean`}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <SparklesIcon size={14} className="text-brand-600" />
          <h3 className="h-display text-base font-semibold text-slate-900">{pair.title}</h3>
        </div>
        <p className="mt-1 text-sm text-slate-600">{pair.description}</p>
      </div>
    </div>
  );
}

function Tile({
  label,
  tone,
  gradient,
  image,
  alt,
}: {
  label: string;
  tone: "before" | "after";
  gradient: string;
  image?: string;
  alt: string;
}) {
  const isAfter = tone === "after";
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden ${
        isAfter ? "bg-gradient-to-br from-slate-100 to-slate-50" : `bg-gradient-to-br ${gradient}`
      }`}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 320px"
          quality={80}
          className="object-cover"
        />
      ) : isAfter ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_80%,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute -left-1/2 top-0 h-full w-[150%] -rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.45),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.55),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.04),transparent_50%)]" />
        </div>
      )}

      {/* Subtle dark gradient at top so the badges stay readable on any photo */}
      {image && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
      )}

      <span
        className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${
          isAfter ? "bg-brand-500 text-white" : "bg-black/55 text-white"
        }`}
      >
        {isAfter ? "Après" : "Avant"}
      </span>
      <span className="absolute bottom-3 left-3 z-10 rounded-md bg-black/55 px-2 py-1 text-[11px] text-white backdrop-blur">
        {label}
      </span>
    </div>
  );
}
