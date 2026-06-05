import Reveal from "./Reveal";
import { StarIcon, SparklesIcon, ArrowRightIcon } from "./Icon";
import type { GoogleReview } from "@/lib/reviews";

type Props = {
  /** Avis Google déjà filtrés sur la section Maison. */
  googleReviews?: GoogleReview[];
  /** Note globale Google de la fiche (auto/maison confondus) */
  googleRating?: number;
  googleTotalCount?: number;
  googleProfileUrl?: string | null;
};

const TONES = [
  "from-amber-500/30 to-orange-500/30",
  "from-orange-500/30 to-rose-500/30",
  "from-amber-400/30 to-yellow-500/30",
  "from-rose-500/30 to-pink-500/30",
  "from-orange-400/30 to-amber-500/30",
  "from-pink-500/30 to-amber-500/30",
];

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

/**
 * Témoignages côté Maison.
 *  - Si on a au moins 1 avis Maison tagué → on affiche la grille classique
 *    d'avis (jusqu'à 6) avec accents ambre.
 *  - Sinon → on affiche un bandeau confiance condensé (note globale Google
 *    + équipe + service 100% domicile) avec CTA vers la fiche Google.
 *
 * Le passage de l'un à l'autre est automatique dès que tu tagues 1 avis
 * "Maison" dans le dashboard admin.
 */
export default function TestimonialsMaison({
  googleReviews,
  googleRating,
  googleTotalCount,
  googleProfileUrl,
}: Props) {
  const hasMaisonReviews = !!googleReviews && googleReviews.length > 0;
  const hasGoogle =
    typeof googleRating === "number" &&
    typeof googleTotalCount === "number" &&
    googleTotalCount > 0;

  return (
    <section id="avis" className="relative overflow-hidden py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 before:h-px before:w-6 before:bg-amber-500 before:opacity-70 before:content-['']">
            Avis clients
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Ce que disent nos clients à Strasbourg.
          </h2>
          {hasGoogle && (
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-4 py-2">
              <span className="flex items-center gap-0.5 text-amber-600">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={18} />
                ))}
              </span>
              <span className="text-base font-bold text-slate-900">
                {googleRating!.toFixed(1).replace(".", ",")}/5
              </span>
              <span className="text-sm text-slate-600">
                · {googleTotalCount} avis Google
              </span>
            </div>
          )}
        </Reveal>

        {hasMaisonReviews ? (
          // Grille des vrais avis Maison — 5 avis + 6e card "voir tous"
          // (pendant visuel de la grille Testimonials Auto)
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {googleReviews!.slice(0, 5).map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <article className="card card-hover h-full">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
                        TONES[i % TONES.length]
                      } text-sm font-bold text-slate-900`}
                    >
                      {initialsOf(r.author_name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {r.author_name}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {r.relative_time_description ?? "Avis Google"}
                      </p>
                    </div>
                  </div>
                  <span className="mt-3 flex gap-0.5 text-amber-600">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <StarIcon key={i} size={14} />
                    ))}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {r.text}
                  </p>
                </article>
              </Reveal>
            ))}

            {/* 6e tuile : CTA "voir tous les avis" sur la fiche Google */}
            {googleProfileUrl && (
              <Reveal delay={5 * 60}>
                <a
                  href={googleProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col items-center justify-center rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-slate-100 to-slate-50 p-6 text-center transition hover:-translate-y-1 hover:border-amber-400/60"
                  aria-label={`Voir les ${googleTotalCount ?? ""} avis Google de StrasClean`}
                >
                  <span className="flex items-center gap-0.5 text-amber-600">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={22} />
                    ))}
                  </span>
                  <p className="h-display mt-3 text-4xl font-extrabold text-slate-900">
                    {(googleRating ?? 5).toFixed(1).replace(".", ",")}
                    <span className="text-2xl text-slate-600">/5</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {googleTotalCount
                      ? `${googleTotalCount} avis Google vérifiés`
                      : "Avis Google vérifiés"}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:border-amber-400/40 group-hover:bg-amber-500/10 group-hover:text-amber-700">
                    Voir tous les avis
                    <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                  </span>
                </a>
              </Reveal>
            )}
          </div>
        ) : (
          // Bandeau confiance condensé (note globale + équipe + 100% domicile)
          <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3">
            <Reveal>
              <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-slate-100 to-slate-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Note Google
                </p>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-3xl font-bold text-slate-900">
                  {hasGoogle ? googleRating!.toFixed(1) : "—"}
                  <span className="inline-flex text-amber-600">
                    <StarIcon size={20} />
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {hasGoogle
                    ? `${googleTotalCount} avis vérifiés`
                    : "Avis vérifiés"}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Équipe
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">2</p>
                <p className="mt-1 text-xs text-slate-600">
                  pros sur chaque intervention
                </p>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Domicile
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">100%</p>
                <p className="mt-1 text-xs text-slate-600">
                  à votre adresse, sans déplacement
                </p>
              </div>
            </Reveal>
          </div>
        )}

        {googleProfileUrl ? (
          <div className="mt-8 flex justify-center">
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20"
            >
              <SparklesIcon size={14} />
              Voir tous les avis Google
              <ArrowRightIcon size={14} />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
