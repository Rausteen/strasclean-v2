import Reveal from "./Reveal";

// Placeholders avant/après stylés en attendant les vraies photos Maison.
// 3 paires illustratives (canapé, tapis, matelas) avec dégradés cohérents
// avec la palette ambre de la verticale Maison.

const PAIRS = [
  {
    label: "Canapé tissu — avant / après",
    sub: "Taches anciennes éliminées · couleur ravivée",
    before: "from-stone-700 via-stone-800 to-stone-900",
    after: "from-amber-300/40 via-amber-400/30 to-amber-500/20",
    icon: "🛋️",
  },
  {
    label: "Tapis salon — avant / après",
    sub: "Saleté profonde extraite · sans auréole",
    before: "from-zinc-700 via-zinc-800 to-zinc-900",
    after: "from-amber-200/40 via-orange-300/30 to-amber-400/20",
    icon: "🧶",
  },
  {
    label: "Matelas 2 personnes — avant / après",
    sub: "Acariens neutralisés · taches transpiration disparues",
    before: "from-neutral-700 via-neutral-800 to-neutral-900",
    after: "from-amber-100/50 via-amber-200/40 to-orange-300/20",
    icon: "🛏️",
  },
];

export default function HomeBeforeAfter() {
  return (
    <section id="avant-apres" className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Le résultat
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Avant / après — la différence visible immédiatement.
          </h2>
          <p className="mt-4 text-white/65">
            Photos clients en cours d'ajout. En attendant, voici à quoi
            s'attendre : une extraction profonde qui restaure la matière
            originale, sans auréole résiduelle.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PAIRS.map((p, i) => (
            <Reveal key={p.label} delay={i * 100}>
              <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                <div className="grid grid-cols-2">
                  <div
                    className={`relative aspect-square bg-gradient-to-br ${p.before}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.4),transparent_60%)]" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/85">
                      Avant
                    </span>
                    <span className="absolute inset-0 grid place-items-center text-5xl opacity-30">
                      {p.icon}
                    </span>
                  </div>
                  <div
                    className={`relative aspect-square bg-gradient-to-br ${p.after}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.15),transparent_60%)]" />
                    <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                      Après
                    </span>
                    <span className="absolute inset-0 grid place-items-center text-5xl">
                      {p.icon}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white">{p.label}</p>
                  <p className="mt-1 text-xs text-white/55">{p.sub}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
