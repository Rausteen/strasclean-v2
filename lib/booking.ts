import { PLANS, VEHICLE_TYPES, AUTO_OPTIONS, autoOptionPrice } from "./plans";
import { CITIES } from "./cities";

// ─────────────────────────────────────────────────────────────────────────
//  Système de réservation Auto — configuration + moteur de disponibilités.
//  Créneaux à heure précise, 1 prestation à la fois (séquentiel), paiement
//  sur place. Tout est ici pour être ajusté facilement.
// ─────────────────────────────────────────────────────────────────────────

export const BOOKING_CONFIG = {
  openMin: 8 * 60, // 08:00 (minutes depuis minuit)
  closeMin: 19 * 60, // 19:00
  slotStepMin: 30, // débuts possibles toutes les 30 min
  bufferMin: 30, // marge de déplacement entre 2 RDV
  leadTimeMin: 120, // délai mini avant un RDV (+2 h)
  horizonDays: 30, // réservation jusqu'à 30 j à l'avance
  cancelHoursBefore: 3, // annulation/report possible jusqu'à 3 h avant
  openDays: [3, 5, 6], // jours pleins (0=dim..6=sam) → mer, ven, sam (8h-19h)
  // Jours "extra" : seulement un créneau matinal, et pas les formules longues.
  extraDays: [0, 1, 2, 4], // dim, lun, mar, jeu
  extraDaySlotsMin: [8 * 60], // uniquement 08:00 ces jours-là
  extraDayMaxDurationMin: 120, // exclut l'Intégrale (150 min) les jours extra
};

export type BookingFormula = {
  id: string;
  name: string;
  durationMin: number;
  priceFrom: number; // base citadine
  emoji: string;
  tagline: string;
  features: string[];
};

// Durée par formule (minutes) — dimensionne les créneaux.
const DURATIONS: Record<string, number> = {
  confort: 60, // Essentiel
  premium: 90, // Premium Intérieur
  luxury: 150, // Intégrale (2h30)
};

export const BOOKING_FORMULAS: BookingFormula[] = PLANS.map((p) => ({
  id: p.id,
  name: p.name.replace(/^Formule /, ""),
  durationMin: DURATIONS[p.id] ?? 90,
  priceFrom: parseInt(p.priceFrom, 10),
  emoji: p.emoji,
  tagline: p.tagline,
  features: p.features,
}));

// ── Codes promo (remise fixe en €), appliqués à la réservation en ligne ──
export const PROMO_CODES: Record<string, number> = {
  STRAS10: 10,
};
/** Remise (€) pour un code donné, 0 si inconnu/vide. Insensible à la casse. */
export function promoDiscount(code: string | null | undefined): number {
  return PROMO_CODES[(code || "").trim().toUpperCase()] ?? 0;
}

export function getFormula(id: string): BookingFormula | undefined {
  return BOOKING_FORMULAS.find((f) => f.id === id);
}

export function getFormulaByName(name: string): BookingFormula | undefined {
  return BOOKING_FORMULAS.find((f) => f.name === name);
}

// ── Zone desservie (codes postaux, depuis lib/cities) ──
const SERVED_POSTAL = new Set(CITIES.flatMap((c) => c.postalCodes));
export function isServedPostal(cp: string): boolean {
  return SERVED_POSTAL.has((cp || "").trim());
}

// ── Prix : base formule + surcharge véhicule + options ──
export function computePrice(
  formulaId: string,
  vehicleId: string,
  optionIds: string[] = [],
): number {
  const f = getFormula(formulaId);
  if (!f) return 0;
  const v = VEHICLE_TYPES.find((x) => x.id === vehicleId);
  let total = f.priceFrom + (v?.surcharge ?? 0);
  for (const oid of optionIds) {
    const o = AUTO_OPTIONS.find((x) => x.id === oid);
    if (o) total += autoOptionPrice(o, vehicleId);
  }
  return total;
}

// ── Moteur de créneaux ──
export type Interval = { start: number; end: number }; // minutes depuis minuit

const pad = (n: number) => String(n).padStart(2, "0");
export function minToHHMM(m: number): string {
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}
export function hhmmToMin(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Renvoie les heures de début disponibles (HH:MM) pour une date + une durée.
 * @param dayStartMs  minuit (ms) du jour considéré
 * @param durationMin durée de la prestation
 * @param busy        créneaux occupés du jour (jobs + blocages), en min/jour
 * @param nowMs       maintenant (ms) — pour le délai mini
 */
export function computeSlots(
  dayStartMs: number,
  durationMin: number,
  busy: Interval[],
  nowMs: number,
): string[] {
  const {
    openMin,
    closeMin,
    slotStepMin,
    bufferMin,
    leadTimeMin,
    openDays,
    extraDays,
    extraDaySlotsMin,
    extraDayMaxDurationMin,
  } = BOOKING_CONFIG;
  const out: string[] = [];
  const wd = new Date(dayStartMs).getDay();
  const minAbsStart = nowMs + leadTimeMin * 60000;

  // Débuts candidats selon le type de jour.
  let starts: number[];
  if (openDays.includes(wd)) {
    // Jour plein : tous les créneaux 8h → 19h.
    starts = [];
    for (let s = openMin; s + durationMin <= closeMin; s += slotStepMin) {
      starts.push(s);
    }
  } else if (extraDays.includes(wd)) {
    // Jour extra : uniquement le(s) créneau(x) matinal(aux), et pas les
    // formules longues (Intégrale).
    if (durationMin > extraDayMaxDurationMin) return out;
    starts = extraDaySlotsMin.filter((s) => s + durationMin <= closeMin);
  } else {
    return out; // jour fermé
  }

  for (const start of starts) {
    const end = start + durationMin;
    // délai mini (heure absolue du créneau)
    if (dayStartMs + start * 60000 < minAbsStart) continue;
    // pas de chevauchement + marge avec un créneau occupé
    const clash = busy.some(
      (b) => start < b.end + bufferMin && end + bufferMin > b.start,
    );
    if (!clash) out.push(minToHHMM(start));
  }
  return out;
}

/** Vrai si le jour (0=dim..6=sam) accepte des réservations (plein OU extra). */
export function isOpenDay(weekday: number): boolean {
  return (
    BOOKING_CONFIG.openDays.includes(weekday) ||
    BOOKING_CONFIG.extraDays.includes(weekday)
  );
}

/** Vrai si le jour est réservable POUR une durée donnée (les jours extra
 *  n'acceptent pas les formules longues, ex. Intégrale 150 min). */
export function isDayBookable(weekday: number, durationMin: number): boolean {
  if (BOOKING_CONFIG.openDays.includes(weekday)) return true;
  if (BOOKING_CONFIG.extraDays.includes(weekday)) {
    return durationMin <= BOOKING_CONFIG.extraDayMaxDurationMin;
  }
  return false;
}
