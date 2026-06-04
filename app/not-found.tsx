import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import {
  WhatsAppIcon,
  CarIcon,
  HomeIcon,
  ArrowRightIcon,
  MapPinIcon,
  SparklesIcon,
} from "@/components/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page introuvable — StrasClean",
  description:
    "Cette page n'existe pas ou plus. Retrouvez StrasClean Auto (nettoyage voiture à domicile) ou StrasClean Maison (canapé, tapis, matelas) à Strasbourg.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-2xl sm:blur-3xl" />
        </div>

        <div className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 before:h-px before:w-6 before:bg-brand-500 before:opacity-70 before:content-['']">
              Erreur 404
            </p>
            <h1 className="h-display mt-3 text-balance text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
              Cette page a roulé un peu trop loin.
            </h1>
            <p className="mt-4 text-balance text-[15px] leading-relaxed text-slate-600 sm:text-lg">
              Le lien est cassé ou la page a été déplacée. Retrouvez-nous via
              l'une des entrées ci-dessous — ou demandez-nous directement par
              WhatsApp.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa h-12 px-6"
              >
                <WhatsAppIcon size={18} />
                Nous écrire sur WhatsApp
              </a>
              <Link href="/" className="btn-ghost h-12 px-6">
                <SparklesIcon size={16} />
                Retour à l'accueil
              </Link>
            </div>
          </div>

          {/* 2 grosses cards : Auto / Maison */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            <Link
              href="/"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-brand-400/40 hover:bg-brand-500/[0.06]"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-600"
                >
                  <CarIcon size={22} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                    StrasClean Auto
                  </p>
                  <h2 className="h-display text-lg font-semibold text-slate-900">
                    Nettoyage voiture à domicile
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Intérieur, shampouinage, désinfection, lavage extérieur,
                detailing complet. À Strasbourg + 12 communes.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Découvrir l'offre Auto
                <ArrowRightIcon size={14} />
              </span>
            </Link>

            <Link
              href="/strasclean-maison"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-500/[0.06]"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-600"
                >
                  <HomeIcon size={22} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                    StrasClean Maison
                  </p>
                  <h2 className="h-display text-lg font-semibold text-slate-900">
                    Nettoyage canapé, tapis, matelas
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Tissu, cuir, alcantara — injection-extraction professionnelle à
                votre domicile. Dès 39 €.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                Découvrir l'offre Maison
                <ArrowRightIcon size={14} />
              </span>
            </Link>
          </div>

          {/* Liens rapides utiles */}
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Pages les plus visitées
            </p>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <li>
                <Link
                  href="/formules"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <ArrowRightIcon size={12} className="text-brand-600" />
                  Formules auto (Confort / Premium / Luxury)
                </Link>
              </li>
              <li>
                <Link
                  href="/nettoyage-canape-strasbourg"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <ArrowRightIcon size={12} className="text-amber-600" />
                  Nettoyage canapé à Strasbourg
                </Link>
              </li>
              <li>
                <Link
                  href="/nettoyage-voiture-domicile-strasbourg"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <ArrowRightIcon size={12} className="text-brand-600" />
                  Nettoyage voiture à Strasbourg
                </Link>
              </li>
              <li>
                <Link
                  href="/nettoyage-matelas-strasbourg"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <ArrowRightIcon size={12} className="text-amber-600" />
                  Nettoyage matelas à Strasbourg
                </Link>
              </li>
              <li>
                <Link
                  href="/prix-nettoyage-canape-strasbourg"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <ArrowRightIcon size={12} className="text-amber-600" />
                  Prix nettoyage canapé
                </Link>
              </li>
              <li>
                <Link
                  href="/strasclean-maison/qui-sommes-nous"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <ArrowRightIcon size={12} className="text-amber-600" />
                  Qui sommes-nous
                </Link>
              </li>
            </ul>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-slate-400">
              <MapPinIcon size={12} className="text-brand-600" />
              Strasbourg + 12 communes alentours — Schiltigheim, Illkirch,
              Ostwald, Lingolsheim, Hoenheim…
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
