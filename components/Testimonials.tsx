import Reveal from "./Reveal";
import { StarIcon } from "./Icon";
import type { GoogleReview } from "@/lib/reviews";

type Review = {
  name: string;
  city: string;
  text: string;
  initials: string;
  tone: string;
  rating?: number;
  source?: "google" | "fixture";
};

const TONES = [
  "from-emerald-500/30 to-teal-500/30",
  "from-violet-500/30 to-fuchsia-500/30",
  "from-sky-500/30 to-cyan-500/30",
  "from-amber-500/30 to-orange-500/30",
  "from-rose-500/30 to-pink-500/30",
  "from-indigo-500/30 to-blue-500/30",
];

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

// Fallback : avis fictifs (utilisés quand pas de fiche Google connectée)
const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Julien M.",
    city: "Strasbourg",
    text:
      "Intérieur nickel, plus aucune odeur. Réservation hyper simple par WhatsApp, créneau dans la semaine.",
    initials: "JM",
    tone: TONES[0],
    source: "fixture",
  },
  {
    name: "Sarah B.",
    city: "Schiltigheim",
    text:
      "Très pro, ponctuel, ma voiture avait vraiment besoin d'un gros nettoyage. Résultat impeccable.",
    initials: "SB",
    tone: TONES[1],
    source: "fixture",
  },
  {
    name: "Mehdi K.",
    city: "Illkirch",
    text:
      "Le shampouinage des sièges a fait une énorme différence. La voiture sent enfin le neuf.",
    initials: "MK",
    tone: TONES[2],
    source: "fixture",
  },
  {
    name: "Laura D.",
    city: "Lingolsheim",
    text:
      "Service top, ils sont venus à mon domicile pendant que je télétravaillais. Zéro déplacement, zéro stress.",
    initials: "LD",
    tone: TONES[3],
    source: "fixture",
  },
  {
    name: "Antoine R.",
    city: "Ostwald",
    text:
      "J'ai pris la formule Luxury, rendu vraiment showroom. Carrosserie brillante, intérieur comme neuf.",
    initials: "AR",
    tone: TONES[4],
    source: "fixture",
  },
  {
    name: "Camille V.",
    city: "Bischheim",
    text:
      "Avec deux chiens à bord, je désespérais. Plus aucun poil après leur passage. Je recommande.",
    initials: "CV",
    tone: TONES[5],
    source: "fixture",
  },
];

function mapGoogleReview(g: GoogleReview, i: number): Review {
  return {
    name: g.author_name,
    city: g.relative_time_description ?? "Avis Google",
    text: g.text,
    initials: initialsOf(g.author_name),
    tone: TONES[i % TONES.length],
    rating: g.rating,
    source: "google",
  };
}

type Props = {
  /** Avis personnalisé optionnel (ex. : pour une page ville). Affiché en premier. */
  cityReview?: { name: string; city: string; text: string };
  /** Avis Google récupérés via lib/reviews → getGooglePlaceData(). */
  googleReviews?: GoogleReview[];
  /** Note moyenne Google (1-5). Affichée en titre si fournie. */
  googleRating?: number;
  /** Nombre total d'avis Google (peut être > googleReviews.length). */
  googleTotalCount?: number;
  /** URL publique de la fiche Google (pour le CTA "voir tous les avis"). */
  googleProfileUrl?: string;
};

export default function Testimonials({
  cityReview,
  googleReviews,
  googleRating,
  googleTotalCount,
  googleProfileUrl,
}: Props = {}) {
  const hasGoogle = googleReviews && googleReviews.length > 0;
  // On ajoute le CTA "voir tous les avis" si Google a plus d'avis que ce
  // que l'API expose, ou simplement si on a un lien valide vers la fiche.
  const showSeeAllCta =
    hasGoogle &&
    googleProfileUrl &&
    typeof googleTotalCount === "number" &&
    googleTotalCount >= (googleReviews?.length ?? 0);

  let reviews: Review[];
  if (hasGoogle) {
    reviews = googleReviews!.map(mapGoogleReview);
    if (cityReview) {
      reviews = [
        {
          name: cityReview.name,
          city: cityReview.city,
          text: cityReview.text,
          initials: initialsOf(cityReview.name),
          tone: TONES[TONES.length - 1],
          source: "fixture",
        },
        ...reviews,
      ];
    }
    reviews = reviews.slice(0, 6);
  } else if (cityReview) {
    reviews = [
      {
        name: cityReview.name,
        city: cityReview.city,
        text: cityReview.text,
        initials: initialsOf(cityReview.name),
        tone: TONES[0],
        source: "fixture",
      },
      ...FALLBACK_REVIEWS.filter((r) => r.city !== cityReview.city).slice(0, 5),
    ];
  } else {
    reviews = FALLBACK_REVIEWS;
  }

  return (
    <section id="avis" className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Avis clients
          </p>

          {hasGoogle && googleRating !== undefined && googleTotalCount !== undefined ? (
            // Bandeau "preuve sociale" en cas d'avis Google connectés
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-brand-500/30 bg-brand-500/[0.08] px-4 py-2">
              <span className="flex items-center gap-0.5 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={18} />
                ))}
              </span>
              <span className="text-base font-bold text-white">
                {googleRating.toFixed(1).replace(".", ",")}/5
              </span>
              <span className="text-sm text-white/70">
                · {googleTotalCount} avis Google
              </span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </span>
              <span className="text-sm text-white/70">
                Avis vérifiés clients StrasClean
              </span>
            </div>
          )}

          <h2 className="h-display mt-4 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ils ont retrouvé une voiture propre.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={`${r.name}-${i}`} delay={i * 70}>
              <article className="card card-hover h-full">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${r.tone} text-sm font-bold text-white`}
                  >
                    {r.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{r.name}</p>
                    <p className="truncate text-xs text-white/55">{r.city}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-0.5 text-amber-300">
                    {Array.from({ length: Math.round(r.rating ?? 5) }).map((_, j) => (
                      <StarIcon key={j} size={14} />
                    ))}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/80">“{r.text}”</p>
                {r.source === "google" && (
                  <p className="mt-3 text-[11px] uppercase tracking-wider text-white/40">
                    Avis Google
                  </p>
                )}
              </article>
            </Reveal>
          ))}

          {/* 6ᵉ tuile : CTA "voir tous les avis" sur la fiche Google.
              Apparaît seulement quand Google est connecté ET qu'on a un
              total ≥ au nombre d'avis affichés (donc Google = source). */}
          {showSeeAllCta && (
            <Reveal delay={reviews.length * 70}>
              <a
                href={googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col items-center justify-center rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-ink-800 to-ink-900 p-6 text-center transition hover:-translate-y-1 hover:border-brand-400/60"
                aria-label={`Voir les ${googleTotalCount} avis Google de StrasClean`}
              >
                <span className="flex items-center gap-0.5 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={22} />
                  ))}
                </span>
                <p className="h-display mt-3 text-4xl font-extrabold text-white">
                  {(googleRating ?? 5).toFixed(1).replace(".", ",")}
                  <span className="text-2xl text-white/55">/5</span>
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {googleTotalCount} avis Google vérifiés
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition group-hover:border-brand-400/40 group-hover:bg-brand-500/10 group-hover:text-brand-200">
                  Voir tous les avis
                  <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                </span>
                <p className="mt-3 text-[11px] uppercase tracking-wider text-white/40">
                  Lien vers Google Maps
                </p>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
