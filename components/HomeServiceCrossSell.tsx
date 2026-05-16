import Link from "next/link";
import Reveal from "./Reveal";
import { HOME_SERVICES, homeServicePath } from "@/lib/homeServices";
import { ArrowRightIcon } from "./Icon";

type Props = {
  /** Slug à exclure de la liste (la page courante) */
  excludeSlug: string;
};

export default function HomeServiceCrossSell({ excludeSlug }: Props) {
  const others = HOME_SERVICES.filter((s) => s.slug !== excludeSlug);
  if (others.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-[360px] w-[640px] rounded-full bg-amber-500/8 blur-3xl" />
      </div>
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Nos autres prestations Maison
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
            On s'occupe aussi de votre intérieur.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {others.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link
                href={homeServicePath(s)}
                prefetch={false}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-amber-500/[0.06]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-2xl">
                  {s.emoji}
                </span>
                <h3 className="h-display mt-4 text-base font-semibold text-white">
                  {s.shortName}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-amber-300">
                    dès {s.pricing.priceFrom} €
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-white/55 group-hover:text-amber-300">
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
