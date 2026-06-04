import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon, ClockIcon } from "@/components/Icon";
import { GUIDES, CATEGORY_LABELS, guidePath } from "@/lib/guides";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guide pratique nettoyage à domicile à Strasbourg — StrasClean",
  description:
    "Conseils, tutos et tarifs pour le nettoyage de votre canapé, matelas, tapis et voiture à Strasbourg. Le guide pratique d'un pro local — réponses honnêtes et méthodes qui marchent.",
  alternates: { canonical: "/guide" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/guide`,
    siteName: SITE.name,
    title: "Guide pratique nettoyage — StrasClean Strasbourg",
    description:
      "Tutos, comparatifs, tarifs : tout pour faire les bons choix en nettoyage textile et auto à Strasbourg.",
    locale: "fr_FR",
  },
};

export default function GuideHubPage() {
  const sorted = [...GUIDES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 before:h-px before:w-6 before:bg-brand-500 before:opacity-70 before:content-['']">
                Guide pratique
              </p>
              <h1 className="h-display mt-3 text-balance text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                Tout savoir avant de réserver.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Tutos, comparatifs, tarifs : les réponses honnêtes d'un pro
                local du nettoyage à Strasbourg. Pas de blabla SEO, juste ce
                qui marche vraiment.
              </p>
            </Reveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
              {sorted.map((g, i) => (
                <Reveal key={g.slug} delay={i * 60}>
                  <Link
                    href={guidePath(g)}
                    className="group flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-md sm:p-7"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
                      <span>{CATEGORY_LABELS[g.category]}</span>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <ClockIcon size={12} />
                        {g.readingMinutes} min
                      </span>
                    </div>

                    <h2 className="h-display text-balance text-xl font-bold text-slate-900 sm:text-2xl">
                      {g.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {g.excerpt}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition group-hover:translate-x-0.5">
                      Lire le guide
                      <ArrowRightIcon size={14} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            {sorted.length < 6 && (
              <Reveal>
                <p className="mt-10 text-center text-sm text-slate-500">
                  De nouveaux guides arrivent régulièrement. Revenez ou
                  abonnez-vous à notre WhatsApp pour ne rien manquer.
                </p>
              </Reveal>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
