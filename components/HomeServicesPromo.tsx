import Link from "next/link";
import Reveal from "./Reveal";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { ArrowRightIcon, SparklesIcon } from "./Icon";

export default function HomeServicesPromo() {
  return (
    <section
      id="maison"
      className="relative overflow-hidden bg-amber-50/60 py-14 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[420px] w-[760px] rounded-full bg-amber-500/10 blur-2xl sm:blur-3xl" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            <SparklesIcon size={14} />
            StrasClean Maison
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            On nettoie aussi votre canapé, tapis et matelas.
          </h2>
          <p className="mt-4 text-slate-600">
            Même équipe, même matériel pro (injection-extraction), même service
            à domicile à Strasbourg. Canapé tissu ou cuir, tapis, matelas,
            fauteuils, chaises : on intervient chez vous, sans rien déplacer.
          </p>
          <Link
            href="/strasclean-maison"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20"
          >
            Découvrir StrasClean Maison
            <ArrowRightIcon size={14} />
          </Link>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <Link
                href={homeServicePath(s)}
                prefetch={false}
                className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-500/[0.06]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-2xl">
                  {s.emoji}
                </span>
                <h3 className="h-display mt-4 text-base font-semibold text-slate-900">
                  {s.shortName}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {/* Hero subtitle est trop long → on prend une version courte
                      construite côté composant à partir du h1 */}
                  {tagline(s.shortName)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-amber-600">
                    dès {s.pricing.priceFrom} €
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600 group-hover:text-amber-600">
                    Voir
                    <ArrowRightIcon
                      size={12}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function tagline(name: string): string {
  switch (name) {
    case "Nettoyage canapé":
      return "Tissu, cuir, alcantara — séchage rapide.";
    case "Nettoyage tapis":
      return "Sans déplacement, sans auréole.";
    case "Nettoyage matelas":
      return "Acariens, taches, transpiration.";
    case "Fauteuils & chaises":
      return "Lot complet en une intervention.";
    default:
      return "À domicile, en équipe de 2.";
  }
}
