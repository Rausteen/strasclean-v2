import Reveal from "./Reveal";
import {
  CheckIcon,
  SparklesIcon,
  ClockIcon,
  ShieldIcon,
  HomeIcon,
  StarIcon,
} from "./Icon";

type Props = {
  /** Note Google globale (auto + maison confondus). */
  googleRating?: number;
  /** Nombre d'avis Google. */
  googleTotalCount?: number;
};

/**
 * Bandeau de confiance Maison.
 *
 * Combine 3 signaux pour rassurer le visiteur quand on n'a pas encore
 * d'avis Maison spécifiques :
 *  1. Volume d'interventions Auto réalisées (preuve d'expérience)
 *  2. Note Google globale (preuve sociale)
 *  3. Mention "Même équipe, même matériel" (rassure sur la cohérence)
 */
export default function MaisonTrustSection({
  googleRating,
  googleTotalCount,
}: Props = {}) {
  const hasGoogle =
    typeof googleRating === "number" &&
    typeof googleTotalCount === "number" &&
    googleTotalCount > 0;

  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[360px] w-[660px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Pourquoi nous faire confiance
          </p>
          <h2 className="h-display mt-3 text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Une équipe locale qui a fait ses preuves sur l'auto — même exigence
            sur votre canapé.
          </h2>
        </Reveal>

        {/* Chiffres clés */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          <Reveal>
            <article className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-ink-800 to-ink-900 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Interventions
              </p>
              <p className="h-display mt-3 text-4xl font-extrabold text-white">
                100+
              </p>
              <p className="mt-1 text-xs text-white/55">
                véhicules nettoyés en équipe
              </p>
            </article>
          </Reveal>

          <Reveal delay={80}>
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Note Google
              </p>
              <p className="h-display mt-3 flex items-center justify-center gap-1.5 text-4xl font-extrabold text-white">
                {hasGoogle ? googleRating!.toFixed(1) : "5.0"}
                <span className="inline-flex text-amber-300">
                  <StarIcon size={22} />
                </span>
              </p>
              <p className="mt-1 text-xs text-white/55">
                {hasGoogle
                  ? `${googleTotalCount} avis vérifiés`
                  : "avis vérifiés"}
              </p>
            </article>
          </Reveal>

          <Reveal delay={160}>
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Communes
              </p>
              <p className="h-display mt-3 text-4xl font-extrabold text-white">
                12
              </p>
              <p className="mt-1 text-xs text-white/55">desservies à domicile</p>
            </article>
          </Reveal>
        </div>

        {/* Piliers de confiance */}
        <Reveal>
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Même équipe, même matériel, même exigence
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-white/75">
              StrasClean Maison utilise <strong className="text-white">le même injecteur-extracteur professionnel</strong> que pour les sièges auto. Les produits adaptés (tissu, cuir, alcantara) viennent des mêmes marques pro (Sonax, Koch Chemie). La même équipe de 2 intervient — avec la même rigueur sur chaque détail.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <li
                  key={p.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-300">
                    {p.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-white/60">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    icon: <SparklesIcon size={16} />,
    title: "Injecteur-extracteur pro",
    desc: "Identique aux services de detailing automobile haut de gamme.",
  },
  {
    icon: <ShieldIcon size={16} />,
    title: "Produits adaptés par matière",
    desc: "Tissu, alcantara, cuir, velours — pH-neutre selon la surface.",
  },
  {
    icon: <ClockIcon size={16} />,
    title: "Séchage rapide",
    desc: "Extraction haute puissance → utilisable le jour même.",
  },
  {
    icon: <HomeIcon size={16} />,
    title: "À domicile, équipe de 2",
    desc: "Zéro déplacement de votre côté, intervention rapide et soignée.",
  },
  {
    icon: <CheckIcon size={16} />,
    title: "Devis ferme avant",
    desc: "Le prix annoncé est le prix payé — pas de surcoût surprise.",
  },
  {
    icon: <SparklesIcon size={16} />,
    title: "Garantie résultat",
    desc: "Si une tache traitable ne part pas, on revient gratuitement.",
  },
];
