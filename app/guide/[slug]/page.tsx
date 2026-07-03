import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon, ClockIcon, WhatsAppIcon } from "@/components/Icon";
import {
  GUIDES,
  CATEGORY_LABELS,
  findGuide,
  guidePath,
} from "@/lib/guides";
import { SITE, waLink } from "@/lib/site";

type Params = { slug: string };

// true : voir app/[slug]/page.tsx — évite NoFallbackError sur les slugs
// inconnus (sert une vraie 404 via notFound() à la place).
export const dynamicParams = true;
export const revalidate = 86400; // 24h

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return {};

  // Les metaTitle de guides n'incluent pas la marque (cf. lib/guides.ts) :
  // on l'ajoute ici puisque le layout n'applique plus de template global.
  const title = `${g.metaTitle} — StrasClean`;

  return {
    title,
    description: g.metaDescription,
    alternates: { canonical: guidePath(g) },
    openGraph: {
      type: "article",
      url: `${SITE.url}${guidePath(g)}`,
      siteName: SITE.name,
      title,
      description: g.metaDescription,
      locale: "fr_FR",
      publishedTime: g.publishedAt,
      modifiedTime: g.updatedAt ?? g.publishedAt,
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  // Articles connexes : même catégorie + 2 plus récents (max 3)
  const related = GUIDES.filter(
    (x) => x.slug !== g.slug && x.category === g.category,
  ).slice(0, 3);

  // JSON-LD Article (boost SEO blog)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    datePublished: g.publishedAt,
    dateModified: g.updatedAt ?? g.publishedAt,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/og.png` },
    },
    mainEntityOfPage: `${SITE.url}${guidePath(g)}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guide",
        item: `${SITE.url}/guide`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: g.title,
        item: `${SITE.url}${guidePath(g)}`,
      },
    ],
  };

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main>
        <article className="relative py-12 sm:py-20">
          <div className="container-x">
            {/* Breadcrumb minimal */}
            <nav
              aria-label="Fil d'Ariane"
              className="mx-auto max-w-3xl text-sm text-slate-500"
            >
              <Link href="/" className="hover:text-slate-900">
                Accueil
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link href="/guide" className="hover:text-slate-900">
                Guide
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-700">{CATEGORY_LABELS[g.category]}</span>
            </nav>

            {/* Header article */}
            <header className="mx-auto mt-6 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
                <span>{CATEGORY_LABELS[g.category]}</span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <ClockIcon size={12} />
                  {g.readingMinutes} min de lecture
                </span>
              </div>

              <h1 className="h-display mt-4 text-balance text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {g.title}
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {g.intro}
              </p>
            </header>

            {/* Sections */}
            <div className="mx-auto mt-12 max-w-3xl space-y-12">
              {g.sections.map((s) => (
                <section key={s.title}>
                  <h2 className="h-display text-2xl font-bold text-slate-900 sm:text-3xl">
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-slate-700">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {s.bullets && (
                    <ul className="mt-5 space-y-2.5 text-[15px] text-slate-700">
                      {s.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                        >
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Conclusion + CTA */}
            <div className="surface-forest mx-auto mt-12 max-w-3xl rounded-3xl p-7 text-white sm:p-10">
              <h2 className="h-display text-xl font-bold sm:text-2xl">
                {g.cta.title}
              </h2>
              <p className="mt-3 text-slate-300">{g.cta.description}</p>
              <p className="mt-5 text-slate-300">{g.conclusion}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waLink(g.cta.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa h-12 px-6 text-base sm:w-auto"
                >
                  <WhatsAppIcon size={18} />
                  Demander un devis par WhatsApp
                </a>
                {g.relatedServiceSlug && (
                  <Link
                    href={`/${g.relatedServiceSlug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Voir le service détaillé
                    <ArrowRightIcon size={14} />
                  </Link>
                )}
              </div>
            </div>

            {/* Articles connexes */}
            {related.length > 0 && (
              <div className="mx-auto mt-16 max-w-5xl">
                <h2 className="h-display text-center text-2xl font-bold text-slate-900 sm:text-3xl">
                  Sur le même sujet
                </h2>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={guidePath(r)}
                      className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-white hover:shadow-md"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                        {CATEGORY_LABELS[r.category]} · {r.readingMinutes} min
                      </span>
                      <h3 className="h-display text-base font-semibold text-slate-900 sm:text-lg">
                        {r.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                        Lire <ArrowRightIcon size={12} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
      <FloatingWhatsApp />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
