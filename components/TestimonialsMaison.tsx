import Reveal from "./Reveal";
import { StarIcon, SparklesIcon, ArrowRightIcon } from "./Icon";
import type { GoogleReview } from "@/lib/reviews";

type Props = {
  /** Note globale Google de la fiche (auto/maison confondus) */
  googleRating?: number;
  googleTotalCount?: number;
  googleProfileUrl?: string | null;
  /** Avis Google bruts — utilisés seulement pour afficher la note globale */
  googleReviews?: GoogleReview[];
};

/**
 * Bloc témoignages pour la verticale Maison.
 *
 * Particularité : tous les avis Google actuels viennent de clients auto
 * (donc mentionnent "voiture"). Les afficher tels quels créerait de la
 * confusion sur les pages Maison ("avis sur le nettoyage de canapé"
 * mentionnant des sièges auto = très étrange).
 *
 * Solution : on affiche uniquement la note globale + un CTA vers la fiche
 * Google, et on cadre clairement "premiers retours Maison à venir".
 * Quand StrasClean aura accumulé 5-10 vrais avis Maison, on pourra
 * basculer sur un affichage similaire à Testimonials auto.
 */
export default function TestimonialsMaison({
  googleRating,
  googleTotalCount,
  googleProfileUrl,
}: Props) {
  const hasGoogle =
    typeof googleRating === "number" &&
    typeof googleTotalCount === "number" &&
    googleTotalCount > 0;

  return (
    <section id="avis" className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[360px] w-[640px] rounded-full bg-amber-500/8 blur-3xl" />
      </div>
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Confiance
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Une équipe locale notée par ses clients.
          </h2>
          <p className="mt-4 text-white/65">
            StrasClean Maison est lancée par la même équipe que StrasClean Auto
            (notée 5/5 sur Google). Les premiers retours Maison arrivent — en
            attendant, vous bénéficiez du même niveau de service et de la même
            exigence.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3">
          {/* Note Google globale */}
          {hasGoogle ? (
            <Reveal>
              <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-ink-800 to-ink-900 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Note Google
                </p>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-3xl font-bold text-white">
                  {googleRating!.toFixed(1)}
                  <span className="inline-flex text-amber-300">
                    <StarIcon size={20} />
                  </span>
                </p>
                <p className="mt-1 text-xs text-white/55">
                  {googleTotalCount} avis vérifiés
                </p>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={80}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Équipe
              </p>
              <p className="mt-3 text-3xl font-bold text-white">2</p>
              <p className="mt-1 text-xs text-white/55">
                pros sur chaque intervention
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Domicile
              </p>
              <p className="mt-3 text-3xl font-bold text-white">100%</p>
              <p className="mt-1 text-xs text-white/55">
                à votre adresse, sans déplacement
              </p>
            </div>
          </Reveal>
        </div>

        {/* CTA fiche Google */}
        {googleProfileUrl ? (
          <div className="mt-8 flex justify-center">
            <a
              href={googleProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
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
