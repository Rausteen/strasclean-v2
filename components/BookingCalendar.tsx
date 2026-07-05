"use client";

import { useEffect, useMemo, useState } from "react";
import { BOOKING_CONFIG, isOpenDay, isDayBookable } from "@/lib/booking";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const pad = (n: number) => String(n).padStart(2, "0");
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Première date réservable (jour ouvré, dans l'horizon) à partir d'aujourd'hui. */
export function firstOpenDay(): string {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  for (let i = 0; i <= BOOKING_CONFIG.horizonDays; i++) {
    const d = new Date(t.getTime() + i * 86400000);
    if (isOpenDay(d.getDay())) return ymd(d);
  }
  return "";
}

export default function BookingCalendar({
  value,
  onSelect,
  durationMin,
}: {
  value: string;
  onSelect: (dateStr: string) => void;
  /** Durée de la prestation → grise les jours extra pour les formules longues. */
  durationMin?: number;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const maxMs = today.getTime() + BOOKING_CONFIG.horizonDays * 86400000;

  const [cursor, setCursor] = useState(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Suit la date sélectionnée si elle est posée par programme (1er jour dispo
  // dans un mois suivant) → le calendrier affiche le bon mois.
  useEffect(() => {
    if (!value) return;
    const [y, m] = value.split("-").map(Number);
    setCursor((c) =>
      c.getFullYear() === y && c.getMonth() === m - 1
        ? c
        : new Date(y, m - 1, 1),
    );
  }, [value]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const selectable = (d: Date) =>
    d.getTime() >= today.getTime() &&
    d.getTime() <= maxMs &&
    (durationMin != null
      ? isDayBookable(d.getDay(), durationMin)
      : isOpenDay(d.getDay()));

  const thisMonthFirst = new Date(today.getFullYear(), today.getMonth(), 1);
  const canPrev = new Date(year, month, 1) > thisMonthFirst;
  const canNext = new Date(year, month + 1, 1).getTime() <= maxMs;

  const monthLabel = cursor.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-bold capitalize text-slate-900">
          {monthLabel}
        </span>
        <div className="flex gap-1">
          <NavBtn
            dir="prev"
            disabled={!canPrev}
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          />
          <NavBtn
            dir="next"
            disabled={!canNext}
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="pb-1 text-center text-[11px] font-semibold text-slate-400"
          >
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const ds = ymd(d);
          const ok = selectable(d);
          const active = ds === value;
          const isToday = d.getTime() === today.getTime();
          return (
            <button
              key={ds}
              type="button"
              disabled={!ok}
              onClick={() => onSelect(ds)}
              className={`relative mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition ${
                active
                  ? "bg-brand-600 text-white shadow"
                  : ok
                    ? "text-slate-800 hover:bg-brand-50"
                    : "cursor-default text-slate-300"
              }`}
            >
              {d.getDate()}
              {ok && !active && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand-500" />
              )}
              {isToday && !active && (
                <span className="absolute -top-0.5 right-1 text-[8px] text-brand-500">
                  •
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Mois précédent" : "Mois suivant"}
      className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30"
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
