import Image from "next/image";
import Reveal from "./Reveal";
import { SparklesIcon } from "./Icon";

type Pair = {
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  /** Couleurs du placeholder Avant si l'image n'est pas encore en place */
  gradient: string;
  /** Chemin de la photo "avant" — public/avant-apres/...webp */
  beforeImage?: string;
  /** Chemin de la photo "après" — public/avant-apres/...webp */
  afterImage?: string;
};

const PAIRS: Pair[] = [
  {
    title: "Sièges & tissus",
    description: "Taches profondes, traces et zones marquées disparues.",
    beforeLabel: "Sièges tachés",
    afterLabel: "Sièges nettoyés",
    gradient: "from-amber-700/60 to-amber-900/60",
    beforeImage: "/avant-apres/siegeavant.webp",
    afterImage: "/avant-apres/siegeapres.webp",
  },
  {
    title: "Moquette & tapis",
    description: "Aspiration, shampouinage et désodorisation en profondeur.",
    beforeLabel: "Tapis sales",
    afterLabel: "Tapis propres",
    gradient: "from-stone-600/60 to-stone-900/60",
    beforeImage: "/avant-apres/tapisavant.webp",
    afterImage: "/avant-apres/tapisapres.webp",
  },
  {
    title: "Tableau de bord",
    description: "Plastiques rénovés, vitres claires et points de contact désinfectés.",
    beforeLabel: "Tableau poussiéreux",
    afterLabel: "Intérieur propre",
    gradient: "from-slate-600/60 to-slate-900/60",
    beforeImage: "/avant-apres/tableauavant.webp",
    afterImage: "/avant-apres/tableauapres.webp",
  },
  {
    title: "Carrosserie",
    description: "Lavage à la main, décontamination et finition brillante.",
    beforeLabel: "Extérieur terne",
    afterLabel: "Extérieur brillant",
    gradient: "from-blue-700/60 to-slate-900/60",
    beforeImage: "/avant-apres/carrosserieavant.webp",
    afterImage: "/avant-apres/carrosserieapres.webp",
  },
];

export default function BeforeAfter() {
  return (
    <section id="avant-apres" className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Avant / Après
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Des résultats visibles dès la première intervention.
          </h2>
          <p className="mt-4 text-white/70">
            Chaque détail compte. On vous montre la différence sur les zones
            qui font le plus de différence dans votre habitacle.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {PAIRS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <BeforeAfterCard pair={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterCard({ pair }: { pair: Pair }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-white/20">
      <div className="grid grid-cols-2 gap-px bg-white/5">
        <Tile
          label={pair.beforeLabel}
          tone="before"
          gradient={pair.gradient}
          image={pair.beforeImage}
          alt={`${pair.title} — avant nettoyage StrasClean`}
        />
        <Tile
          label={pair.afterLabel}
          tone="after"
          gradient={pair.gradient}
          image={pair.afterImage}
          alt={`${pair.title} — après nettoyage StrasClean`}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <SparklesIcon size={14} className="text-brand-400" />
          <h3 className="h-display text-base font-semibold text-white">{pair.title}</h3>
        </div>
        <p className="mt-1 text-sm text-white/65">{pair.description}</p>
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
        isAfter ? "bg-gradient-to-br from-ink-800 to-ink-900" : `bg-gradient-to-br ${gradient}`
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
          isAfter ? "bg-brand-500 text-ink-950" : "bg-black/55 text-white"
        }`}
      >
        {isAfter ? "Après" : "Avant"}
      </span>
      <span className="absolute bottom-3 left-3 z-10 rounded-md bg-black/55 px-2 py-1 text-[11px] text-white/90 backdrop-blur">
        {label}
      </span>
    </div>
  );
}
