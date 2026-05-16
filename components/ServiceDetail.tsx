import Reveal from "./Reveal";
import { waLink } from "@/lib/site";
import { City, inCity } from "@/lib/cities";
import { Service } from "@/lib/services";
import { CheckIcon, WhatsAppIcon } from "./Icon";

export default function ServiceDetail({
  service,
  city,
}: {
  service: Service;
  city: City;
}) {
  const message = `${service.ctaMessage} à ${city.name}. Quels sont vos prochains créneaux ?`;

  return (
    <section className="relative py-14 sm:py-24 lg:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            La prestation
          </p>
          <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {service.name} — comment ça se passe.
          </h2>
          <p className="mt-4 text-white/75">{service.introTemplate(city)}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-2">
          {/* Inclus */}
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
              <h3 className="h-display text-xl font-semibold text-white">
                Inclus dans la prestation
              </h3>
              <ul className="mt-5 space-y-3">
                {service.whatsIncluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-white/85"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-ink-950">
                      <CheckIcon size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                <span>
                  Durée : <strong className="text-white">{service.duration}</strong>
                </span>
                <span className="text-white/30">·</span>
                <span>
                  À partir de{" "}
                  <strong className="text-white">{service.priceFrom} €</strong>
                </span>
              </div>
            </div>
          </Reveal>

          {/* Pourquoi */}
          <Reveal delay={120}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/10 to-ink-900 p-7 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand-500/15 blur-2xl sm:blur-3xl" />
              <h3 className="h-display text-xl font-semibold text-white">
                Pourquoi {service.shortName.toLowerCase()} avec StrasClean
              </h3>
              <ul className="mt-5 space-y-4">
                {service.whyChoose.map((w) => (
                  <li key={w.title} className="flex gap-4">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                      <CheckIcon size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{w.title}</p>
                      <p className="mt-0.5 text-sm text-white/70">{w.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa mt-7 h-12 w-full"
              >
                <WhatsAppIcon size={18} />
                Demander un créneau {inCity(city)}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Service-specific FAQ */}
        {service.faq.length > 0 && (
          <Reveal>
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h3 className="h-display text-xl font-semibold text-white sm:text-2xl">
                Questions fréquentes — {service.shortName}
              </h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.faq.map((q) => (
                  <li
                    key={q.q}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <p className="text-sm font-semibold text-white">{q.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {q.a}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
