import Reveal from "./Reveal";
import {
  HomeIcon,
  ClockIcon,
  SparklesIcon,
  ShieldIcon,
  SprayIcon,
  CheckIcon,
  WhatsAppIcon,
  MapPinIcon,
  CarIcon,
} from "./Icon";

const BENEFITS = [
  {
    icon: <HomeIcon />,
    title: "Service à domicile",
    desc: "On vient chez vous, à votre travail ou à l'adresse de votre choix.",
  },
  {
    icon: <ClockIcon />,
    title: "Gain de temps",
    desc: "Plus de file d'attente en station. Vous gardez votre temps libre.",
  },
  {
    icon: <SprayIcon />,
    title: "Matériel professionnel",
    desc: "Aspirateur pro, injecteur-extracteur et produits adaptés.",
  },
  {
    icon: <SparklesIcon />,
    title: "Nettoyage en profondeur",
    desc: "Pas un coup d'aspirateur — un vrai traitement intérieur.",
  },
  {
    icon: <ShieldIcon />,
    title: "Produits adaptés",
    desc: "Des produits qui respectent les surfaces auto (cuir, tissu, plastique).",
  },
  {
    icon: <CheckIcon />,
    title: "Formules claires",
    desc: "Trois formules transparentes, sans frais cachés.",
  },
  {
    icon: <WhatsAppIcon />,
    title: "Contact direct WhatsApp",
    desc: "Réponse rapide, photos avant intervention, devis clair.",
  },
  {
    icon: <MapPinIcon />,
    title: "Strasbourg & alentours",
    desc: "12 communes desservies autour de Strasbourg.",
  },
  {
    icon: <CarIcon />,
    title: "Tous types de véhicules",
    desc: "Citadine, berline, SUV, utilitaire — un tarif adapté à chaque taille.",
  },
];

export default function Benefits() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[400px] w-[700px] rounded-full bg-brand-500/10 blur-3xl" />
      </div>
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            Pourquoi nous choisir
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Un nettoyage auto pensé pour vous, pas pour la station.
          </h2>
          <p className="mt-4 text-white/70">
            Un service local, sérieux et résolument premium. Voilà ce que vous
            obtenez quand vous réservez chez StrasClean.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 50}>
              <div className="card card-hover h-full">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-300">
                  {b.icon}
                </span>
                <h3 className="h-display mt-4 text-base font-semibold text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-white/65">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
