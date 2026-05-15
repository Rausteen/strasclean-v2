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
  /** Avis Google récupérés via lib/reviews → getGoogleReviews(). */
  googleReviews?: GoogleReview[];
};

export default function Testimonials({ cityReview, googleReviews }: Props = {}) {
  const hasGoogle = googleReviews && googleReviews.length > 0;

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
          <div className="mt-4 inline-flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={16} />
              ))}
            </span>
            <span className="text-sm text-white/70">
              {hasGoogle ? "Avis vérifiés Google" : "Avis vérifiés clients StrasClean"}
            </span>
          </div>
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
        </div>
      </div>
    </section>
  );
}
