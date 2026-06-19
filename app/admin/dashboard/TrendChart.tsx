"use client";

import { useState } from "react";

// Forme sérialisable d'un point quotidien (mirroir de DailyPoint côté serveur,
// redéfini ici pour ne pas importer lib/db — qui est "server-only" — dans un
// composant client).
type Point = {
  day: string;
  label: string;
  visits: number;
  whatsapp: number;
  phone: number;
  leads: number;
};

type MetricKey = "visits" | "contacts" | "leads";

const METRICS: {
  key: MetricKey;
  label: string;
  color: string;
  get: (p: Point) => number;
}[] = [
  { key: "visits", label: "Visites", color: "#16a34a", get: (p) => p.visits },
  {
    key: "contacts",
    label: "Contacts",
    color: "#0284c7",
    get: (p) => p.whatsapp + p.phone,
  },
  { key: "leads", label: "Leads", color: "#d97706", get: (p) => p.leads },
];

// Repère SVG fixe ; le rendu est mis à l'échelle en largeur via CSS (responsive).
const VBW = 720;
const VBH = 240;
const PAD = { top: 18, right: 14, bottom: 26, left: 14 };
const PLOT_W = VBW - PAD.left - PAD.right;
const PLOT_H = VBH - PAD.top - PAD.bottom;

export default function TrendChart({ data }: { data: Point[] }) {
  const [metric, setMetric] = useState<MetricKey>("visits");
  const [hover, setHover] = useState<number | null>(null);

  const active = METRICS.find((m) => m.key === metric)!;
  const n = data.length;
  const denom = Math.max(1, n - 1);
  const values = data.map(active.get);
  const max = Math.max(1, ...values);

  const x = (i: number) => PAD.left + (i / denom) * PLOT_W;
  const y = (v: number) => PAD.top + (1 - v / max) * PLOT_H;
  const baseY = PAD.top + PLOT_H;

  const pts = data.map((d, i) => [x(i), y(active.get(d))] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const area =
    n > 0
      ? `M ${x(0)} ${baseY} ${pts.map((p) => `L ${p[0]} ${p[1]}`).join(" ")} L ${x(n - 1)} ${baseY} Z`
      : "";

  // Libellés d'axe X : ~6 jalons espacés régulièrement pour éviter le fouillis.
  const labelEvery = Math.max(1, Math.ceil(n / 6));

  const total = values.reduce((s, v) => s + v, 0);

  return (
    <div>
      {/* Barre de contrôle : choix de la métrique tracée */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                metric === m.key
                  ? "text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              style={metric === m.key ? { backgroundColor: m.color } : undefined}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{total}</span>{" "}
          {active.label.toLowerCase()} sur {n}j
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VBW} ${VBH}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Tendance ${active.label} sur ${n} jours`}
        >
          {/* Lignes de repère horizontales + graduations */}
          {[0, 0.5, 1].map((f) => {
            const gy = PAD.top + f * PLOT_H;
            const val = Math.round(max * (1 - f));
            return (
              <g key={f}>
                <line
                  x1={PAD.left}
                  x2={VBW - PAD.right}
                  y1={gy}
                  y2={gy}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text x={PAD.left} y={gy - 3} fontSize={10} fill="#94a3b8">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Aire + courbe de la métrique active */}
          {area && <path d={area} fill={active.color} fillOpacity={0.12} />}
          <path
            d={line}
            fill="none"
            stroke={active.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Guide vertical + point au survol */}
          {hover !== null && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={baseY}
                stroke={active.color}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <circle
                cx={x(hover)}
                cy={y(values[hover])}
                r={4}
                fill="#fff"
                stroke={active.color}
                strokeWidth={2.5}
              />
            </g>
          )}

          {/* Libellés d'axe X */}
          {data.map((d, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text
                key={d.day}
                x={x(i)}
                y={VBH - 8}
                fontSize={10}
                fill="#94a3b8"
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
              >
                {d.label}
              </text>
            ) : null,
          )}

          {/* Zones de survol invisibles : robustes à la mise à l'échelle */}
          {data.map((d, i) => (
            <rect
              key={d.day}
              x={x(i) - PLOT_W / denom / 2}
              y={PAD.top}
              width={PLOT_W / denom}
              height={PLOT_H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            />
          ))}
        </svg>

        {/* Infobulle HTML positionnée en pourcentage (suit la mise à l'échelle) */}
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(hover / denom) * 100}%`,
              maxWidth: "180px",
            }}
          >
            <p className="mb-1 font-semibold text-slate-900">
              {data[hover].label}
            </p>
            <Row color="#16a34a" label="Visites" value={data[hover].visits} />
            <Row
              color="#0284c7"
              label="Contacts"
              value={data[hover].whatsapp + data[hover].phone}
              hint={`${data[hover].whatsapp} WA · ${data[hover].phone} tél`}
            />
            <Row color="#d97706" label="Leads" value={data[hover].leads} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  color,
  label,
  value,
  hint,
}: {
  color: string;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 py-0.5 text-slate-600">
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
      <span className="ml-auto font-semibold text-slate-900">{value}</span>
      {hint && <span className="ml-1 text-[10px] text-slate-400">{hint}</span>}
    </div>
  );
}
