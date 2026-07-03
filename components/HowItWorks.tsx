import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRightIcon } from "./Icon";

const STEPS = [
  {
    n: "01",
    title: "Choisissez votre formule",
    desc: "Essentiel, Premium Intérieur ou Intégrale StrasClean — selon l'état de votre véhicule. Ajoutez vos options si besoin.",
  },
  {
    n: "02",
    title: "Réservez votre créneau en ligne",
    desc: "Sélectionnez le jour et l'heure précise qui vous arrangent. Disponibilités en temps réel, en moins d'une minute.",
  },
  {
    n: "03",
    title: "Confirmation immédiate",
    desc: "Vous recevez votre confirmation par email, avec un rappel la veille. Modifiable ou annulable en un clic.",
  },
  {
    n: "04",
    title: "On nettoie votre voiture chez vous",
    desc: "À votre domicile, au travail ou à l'adresse de votre choix. Paiement sur place, sans engagement.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="fonctionnement"
      className="relative border-y border-brand-500/10 bg-gradient-to-b from-brand-50 via-white to-brand-50/50 py-16 sm:py-24"
    >
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700 before:h-px before:w-6 before:bg-brand-500 before:opacity-80 before:content-['']">
            Comment ça marche
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Réservez en ligne en 1 minute.{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              On s'occupe du reste.
            </span>
          </h2>
          <p className="mt-4 text-slate-600">
            Pas besoin de vous déplacer ni d'attendre un rappel. Vous choisissez
            votre créneau, on vient, votre voiture retrouve un intérieur propre et
            agréable.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="group h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="h-display bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-[44px] font-extrabold leading-none text-transparent">
                    {s.n}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-200 bg-brand-50 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                </div>
                <h3 className="h-display mt-5 text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/reserver" className="btn-primary h-12 px-6">
            Réserver en ligne
            <ArrowRightIcon size={16} />
          </Link>
          <a href="#formules" className="btn-ghost h-12 px-6">
            Voir les formules
          </a>
        </Reveal>
      </div>
    </section>
  );
}
