import { VEHICLE_TYPES } from "@/lib/plans";

/**
 * Bandeau "tarif selon véhicule" — affiché après les cards de formules.
 * Le prix de base des 3 formules correspond à une citadine ; les véhicules
 * plus volumineux ont un supplément forfaitaire affiché ici.
 */
export default function VehiclePricing() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
          Tarif selon votre véhicule
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/65">
          Le prix de chaque formule s'applique à une citadine. Pour les
          véhicules plus volumineux, un léger supplément s'ajoute.
        </p>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {VEHICLE_TYPES.map((v) => (
          <li
            key={v.id}
            className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center"
          >
            <span className="text-2xl leading-none" aria-hidden>{v.emoji}</span>
            <p className="mt-1.5 text-sm font-semibold text-white">{v.label}</p>
            <p
              className={`mt-0.5 text-xs font-medium ${
                v.surcharge === 0 ? "text-brand-300" : "text-white/65"
              }`}
            >
              {v.surcharge === 0 ? "Tarif de base" : `+ ${v.surcharge} €`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
