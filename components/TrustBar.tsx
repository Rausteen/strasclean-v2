import { StarIcon } from "./Icon";

/**
 * TrustBar — bande de 4 stats clés sous le Hero.
 *
 * Spec maquette : note Google, communes desservies, équipe de 2,
 * horaires. Mobile = 2×2, desktop = 4 colonnes avec hairlines verticales.
 *
 * La 1re stat (note) est désormais pilotée par les VRAIS avis Google
 * passés en props. Plus de "5,0 / vérifiés" codé en dur : on n'affiche
 * "avis Google vérifiés" que lorsqu'on a une vraie note + un volume.
 */
type TrustBarProps = {
  rating?: number;
  reviewCount?: number;
};

export default function TrustBar({ rating, reviewCount }: TrustBarProps = {}) {
  const hasRating =
    typeof rating === "number" && typeof reviewCount === "number" && reviewCount > 0;

  const STATS = [
    {
      big: (
        <>
          <span className="text-amber-600">
            <StarIcon size={22} />
          </span>
          <span>{hasRating ? rating!.toFixed(1).replace(".", ",") : "5,0"}</span>
        </>
      ),
      label: hasRating ? `${reviewCount} avis Google vérifiés` : "Avis clients",
    },
    {
      big: <span>12</span>,
      label: "communes desservies",
    },
    {
      big: <span>2</span>,
      label: "techniciens par intervention",
    },
    {
      big: <span>8h–22h</span>,
      label: "7j/7, paiement sur place",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-100">
      <div className="container-x">
        <ul className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <li
              key={i}
              className={`px-4 py-5 text-center sm:py-6 ${
                // hairlines : mobile 2×2 → barre verticale entre colonnes
                // + horizontale entre lignes ; desktop → 3 barres verticales.
                i < 2 ? "border-b border-slate-200 md:border-b-0" : ""
              } ${
                i % 2 === 0 ? "border-r border-slate-200 md:border-r-0" : ""
              } ${i < 3 ? "md:border-r md:border-slate-200" : ""}`}
            >
              <div className="h-display inline-flex items-center gap-1.5 text-[26px] font-bold leading-none text-slate-900">
                {s.big}
              </div>
              <p className="mt-1.5 text-[13px] text-slate-500">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
