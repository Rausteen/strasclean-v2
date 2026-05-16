import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Reveal from "./Reveal";

// ─────────────────────────────────────────────────────────────────────────
//  HomeBeforeAfter — bloc "avant/après" Maison
//
//  Charge automatiquement les vraies photos clients si elles existent dans
//  /public/maison/before-after/, sinon affiche un placeholder gradient
//  cohérent avec la palette ambre.
//
//  Convention pour uploader des photos :
//   /public/maison/before-after/canape-before.webp
//   /public/maison/before-after/canape-after.webp
//   /public/maison/before-after/tapis-before.webp
//   /public/maison/before-after/tapis-after.webp
//   /public/maison/before-after/matelas-before.webp
//   /public/maison/before-after/matelas-after.webp
//
//  Formats acceptés : .webp (recommandé), .jpg, .jpeg, .png
//  Dimensions recommandées : 800×800 minimum (carré), poids <200 KB chacune.
//  Après upload : `pm2 restart strasclean` pour rebuild.
// ─────────────────────────────────────────────────────────────────────────

type Pair = {
  slug: string;
  label: string;
  sub: string;
  icon: string;
  beforeGradient: string;
  afterGradient: string;
};

const PAIRS: Pair[] = [
  {
    slug: "canape",
    label: "Canapé tissu — avant / après",
    sub: "Taches anciennes éliminées · couleur ravivée",
    icon: "🛋️",
    beforeGradient: "from-stone-700 via-stone-800 to-stone-900",
    afterGradient: "from-amber-300/40 via-amber-400/30 to-amber-500/20",
  },
  {
    slug: "tapis",
    label: "Tapis salon — avant / après",
    sub: "Saleté profonde extraite · sans auréole",
    icon: "🧶",
    beforeGradient: "from-zinc-700 via-zinc-800 to-zinc-900",
    afterGradient: "from-amber-200/40 via-orange-300/30 to-amber-400/20",
  },
  {
    slug: "matelas",
    label: "Matelas 2 personnes — avant / après",
    sub: "Acariens neutralisés · taches transpiration disparues",
    icon: "🛏️",
    beforeGradient: "from-neutral-700 via-neutral-800 to-neutral-900",
    afterGradient: "from-amber-100/50 via-amber-200/40 to-orange-300/20",
  },
];

const EXT_ORDER = ["webp", "jpg", "jpeg", "png"] as const;
const PHOTO_DIR = path.join(process.cwd(), "public", "maison", "before-after");

/** Cherche un fichier {slug}-{kind}.{ext} dans le dossier — renvoie le chemin
 *  public (/maison/before-after/...) si trouvé, null sinon. */
function findPhoto(slug: string, kind: "before" | "after"): string | null {
  for (const ext of EXT_ORDER) {
    const filename = `${slug}-${kind}.${ext}`;
    const full = path.join(PHOTO_DIR, filename);
    if (fs.existsSync(full)) {
      return `/maison/before-after/${filename}`;
    }
  }
  return null;
}

export default function HomeBeforeAfter() {
  // Résout les photos une fois côté serveur au build/render
  const pairs = PAIRS.map((p) => ({
    ...p,
    beforeSrc: findPhoto(p.slug, "before"),
    afterSrc: findPhoto(p.slug, "after"),
  }));

  const hasRealPhotos = pairs.some((p) => p.beforeSrc || p.afterSrc);

  return (
    <section
      id="avant-apres"
      className="relative overflow-hidden py-14 sm:py-24 lg:py-28"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Le résultat
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Avant / après — la différence visible immédiatement.
          </h2>
          <p className="mt-4 text-white/65">
            {hasRealPhotos
              ? "Photos prises lors de nos interventions clients à Strasbourg. Extraction profonde, matière d'origine restaurée, aucune auréole."
              : "Une extraction profonde qui décolle les taches incrustées et restaure la matière d'origine — sans auréole résiduelle, sans humidité excessive. Voici quelques rendus types après notre intervention."}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pairs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                <div className="grid grid-cols-2">
                  {/* Avant */}
                  <div
                    className={`relative aspect-square overflow-hidden ${
                      p.beforeSrc ? "" : `bg-gradient-to-br ${p.beforeGradient}`
                    }`}
                  >
                    {p.beforeSrc ? (
                      <Image
                        src={p.beforeSrc}
                        alt={`${p.label} — avant intervention StrasClean`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 200px"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.4),transparent_60%)]" />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 grid place-items-center text-5xl opacity-30"
                        >
                          {p.icon}
                        </span>
                      </>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm">
                      Avant
                    </span>
                  </div>

                  {/* Après */}
                  <div
                    className={`relative aspect-square overflow-hidden ${
                      p.afterSrc ? "" : `bg-gradient-to-br ${p.afterGradient}`
                    }`}
                  >
                    {p.afterSrc ? (
                      <Image
                        src={p.afterSrc}
                        alt={`${p.label} — après intervention StrasClean`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 200px"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.15),transparent_60%)]" />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 grid place-items-center text-5xl"
                        >
                          {p.icon}
                        </span>
                      </>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                      Après
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white">{p.label}</p>
                  <p className="mt-1 text-xs text-white/65">{p.sub}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
