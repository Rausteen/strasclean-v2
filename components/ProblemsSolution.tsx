import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import { ArrowRightIcon, WhatsAppIcon } from "./Icon";

const problems = [
  "Voiture sale et poussiéreuse",
  "Mauvaises odeurs persistantes",
  "Poils d'animaux partout",
  "Taches sur les sièges et tapis",
  "Plastiques ternes et marqués",
  "Pas le temps d'aller en centre de lavage",
];

export default function ProblemsSolution() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
              Le problème
            </p>
            <h2 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
              Une voiture sale, c'est plus qu'un détail.
            </h2>
            <p className="mt-4 text-white/70">
              Au quotidien, la saleté s'accumule, les odeurs s'installent et
              l'intérieur perd de sa valeur. Et trouver le temps d'aller en
              centre de lavage est souvent la dernière chose qu'on a envie de
              faire.
            </p>

            <ul className="mt-8 grid gap-3">
              {problems.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/15 via-ink-800 to-ink-900 p-8 sm:p-10">
              <div className="absolute inset-0 -z-10 bg-grid-light bg-[size:36px_36px] opacity-[0.25]" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">
                La solution StrasClean
              </p>
              <h3 className="h-display mt-3 text-balance text-3xl font-bold text-white sm:text-4xl">
                On vient directement chez vous.
              </h3>
              <p className="mt-4 text-white/80">
                Avec le matériel et les produits adaptés, on s'occupe de tout&nbsp;:
                aspiration profonde, shampouinage, désinfection, traitement des
                surfaces. Vous récupérez une voiture propre, saine et agréable
                à conduire — sans avoir bougé.
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "On se déplace, vous gagnez du temps",
                  "Matériel pro autonome",
                  "Produits adaptés à chaque surface",
                  "Résultat visible dès la 1ʳᵉ intervention",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-white/90"
                  >
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-ink-950">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa"
                >
                  <WhatsAppIcon size={18} />
                  Réserver sur WhatsApp
                </a>
                <a href="#formules" className="btn-ghost">
                  Voir les formules <ArrowRightIcon size={16} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
