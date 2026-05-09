import Reveal from "./Reveal";
import { StarIcon } from "./Icon";

type Review = { name: string; city: string; text: string; initials: string; tone: string };

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

const REVIEWS: Review[] = [
  {
    name: "Julien M.",
    city: "Strasbourg",
    text:
      "Intérieur nickel, plus aucune odeur. Réservation hyper simple par WhatsApp, créneau dans la semaine.",
    initials: "JM",
    tone: "from-emerald-500/30 to-teal-500/30",
  },
  {
    name: "Sarah B.",
    city: "Schiltigheim",
    text:
      "Très pro, ponctuel, ma voiture avait vraiment besoin d'un gros nettoyage. Résultat impeccable.",
    initials: "SB",
    tone: "from-violet-500/30 to-fuchsia-500/30",
  },
  {
    name: "Mehdi K.",
    city: "Illkirch",
    text:
      "Le shampouinage des sièges a fait une énorme différence. La voiture sent enfin le neuf.",
    initials: "MK",
    tone: "from-sky-500/30 to-cyan-500/30",
  },
  {
    name: "Laura D.",
    city: "Lingolsheim",
    text:
      "Service top, ils sont venus à mon domicile pendant que je télétravaillais. Zéro déplacement, zéro stress.",
    initials: "LD",
    tone: "from-amber-500/30 to-orange-500/30",
  },
  {
    name: "Antoine R.",
    city: "Ostwald",
    text:
      "J'ai pris la formule Luxury, rendu vraiment showroom. Carrosserie brillante, intérieur comme neuf.",
    initials: "AR",
    tone: "from-rose-500/30 to-pink-500/30",
  },
  {
    name: "Camille V.",
    city: "Bischheim",
    text:
      "Avec deux chiens à bord, je désespérais. Plus aucun poil après leur passage. Je recommande.",
    initials: "CV",
    tone: "from-indigo-500/30 to-blue-500/30",
  },
];

type Props = {
  /** Avis personnalisé optionnel (ex. : pour une page ville). Affiché en premier. */
  cityReview?: { name: string; city: string; text: string };
};

export default function Testimonials({ cityReview }: Props = {}) {
  const reviews: Review[] = cityReview
    ? [
        {
          name: cityReview.name,
          city: cityReview.city,
          text: cityReview.text,
          initials: initialsOf(cityReview.name),
          tone: TONES[0],
        },
        ...REVIEWS.filter((r) => r.city !== cityReview.city).slice(0, 5),
      ]
    : REVIEWS;

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
            <span className="text-sm text-white/70">Avis vérifiés clients StrasClean</span>
          </div>
          <h2 className="h-display mt-4 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ils ont retrouvé une voiture propre.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 70}>
              <article className="card card-hover h-full">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${r.tone} text-sm font-bold text-white`}
                  >
                    {r.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs text-white/55">{r.city}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-0.5 text-amber-300">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <StarIcon key={j} size={14} />
                    ))}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  “{r.text}”
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
