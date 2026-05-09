import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import { WhatsAppIcon, ArrowRightIcon } from "./Icon";

const STEPS = [
  {
    n: "01",
    title: "Vous choisissez votre formule",
    desc: "Confort, Premium ou Luxury Detailing — selon l'état de votre véhicule et votre besoin.",
  },
  {
    n: "02",
    title: "Vous envoyez un message WhatsApp",
    desc: "Une photo de votre voiture suffit pour qu'on vous confirme la formule adaptée.",
  },
  {
    n: "03",
    title: "On fixe un créneau près de chez vous",
    desc: "Strasbourg ou alentours, à votre domicile, votre travail ou l'adresse de votre choix.",
  },
  {
    n: "04",
    title: "On nettoie votre voiture à domicile",
    desc: "Vous récupérez un véhicule propre, sain et agréable à conduire — sans avoir bougé.",
  },
];

export default function HowItWorks() {
  return (
    <section id="fonctionnement" className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Comment ça marche
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Réservez en quelques secondes. On s'occupe du reste.
          </h2>
          <p className="mt-4 text-white/70">
            Pas besoin de vous déplacer. Vous réservez, on vient, votre voiture
            retrouve un intérieur propre et agréable.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="card card-hover h-full">
                <div className="flex items-center justify-between">
                  <span className="h-display text-3xl font-extrabold text-brand-400">
                    {s.n}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70">
                    {i + 1}
                  </span>
                </div>
                <h3 className="h-display mt-4 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-white/65">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa h-12 px-6"
          >
            <WhatsAppIcon size={18} />
            Réserver mon créneau
          </a>
          <a href="#formules" className="btn-ghost h-12 px-6">
            Voir les formules <ArrowRightIcon size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
