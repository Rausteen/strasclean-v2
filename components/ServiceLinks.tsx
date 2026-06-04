import Link from "next/link";
import Reveal from "./Reveal";
import { MapPinIcon, ArrowRightIcon } from "./Icon";

export type ServiceLinkItem = {
  label: string;
  sublabel?: string;
  href: string;
  emoji?: string;
};

/**
 * Grille de liens internes — utilisée pour le maillage SEO :
 *  - "Autres prestations à {Ville}" (variant="service")
 *  - "{Service} dans d'autres villes"   (variant="city")
 */
export default function ServiceLinks({
  eyebrow,
  title,
  description,
  items,
  variant = "city",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  items: ServiceLinkItem[];
  variant?: "city" | "service";
}) {
  return (
    <section className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            {eyebrow}
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-4 text-slate-600">{description}</p>}
        </Reveal>

        <Reveal>
          <ul
            className={`mt-10 grid gap-3 ${
              variant === "service"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  prefetch={false}
                  className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-slate-900"
                >
                  <span className="inline-flex items-start gap-2">
                    {variant === "city" ? (
                      <MapPinIcon size={14} className="mt-1 text-brand-600" />
                    ) : (
                      <span className="text-base leading-none">{it.emoji}</span>
                    )}
                    <span className="text-left">
                      <span className="block">{it.label}</span>
                      {it.sublabel && (
                        <span className="block text-xs text-slate-500">
                          {it.sublabel}
                        </span>
                      )}
                    </span>
                  </span>
                  <ArrowRightIcon
                    size={14}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
