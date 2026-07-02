"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PLANS, VEHICLE_TYPES } from "@/lib/plans";
import { getFormulaByName, BOOKING_CONFIG } from "@/lib/booking";

// Forme d'un job (miroir de lib/db Job — défini ici car lib/db est server-only).
type Job = {
  id: number;
  ts: number;
  phone: string | null;
  prestation: string | null;
  vehicle_type: string | null;
  price: number;
  supplements: number;
  total: number;
  collected: number;
  payment: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  booking_id: number | null;
  scheduled_at: number | null;
  duration_min: number | null;
  customer_name: string | null;
  email: string | null;
  address: string | null;
  lead_id: number | null;
  created_at: number;
};

// ─── Constantes ──────────────────────────────────────────────────────────
const STATUSES: { id: string; label: string; cls: string }[] = [
  { id: "a_faire", label: "À faire", cls: "bg-amber-100 text-amber-800" },
  { id: "termine", label: "Terminé", cls: "bg-brand-100 text-brand-800" },
];
const PAYMENTS = ["Espèces", "Carte", "Virement"];
const SOURCES = ["Meta Ads", "WhatsApp", "Téléphone", "Formulaire", "Bouche à oreille"];

// Forme d'un lead (miroir de lib/db Lead — lib/db est server-only).
type Lead = {
  id: number;
  ts: number;
  source: string | null;
  meta_lead_id: string | null;
  form_id: string | null;
  ad_id: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  raw: string | null;
  status: string;
  notes: string | null;
  created_at: number;
};

const LEAD_STATUSES: { id: string; label: string; cls: string }[] = [
  { id: "nouveau", label: "Nouveau", cls: "bg-sky-100 text-sky-800" },
  { id: "a_relancer", label: "À relancer", cls: "bg-amber-100 text-amber-800" },
  { id: "converti", label: "Converti", cls: "bg-brand-100 text-brand-800" },
  { id: "perdu", label: "Perdu", cls: "bg-slate-100 text-slate-500" },
];

type Block = {
  id: number;
  start_at: number;
  end_at: number;
  reason: string | null;
  created_at: number;
};

// Prestations + prix de base : les 3 formules (lib/plans) + l'extérieur seul.
const PRESTATIONS: { label: string; base: number }[] = [
  ...PLANS.map((p) => ({
    label: p.name.replace(/^Formule /, ""),
    base: parseInt(p.priceFrom, 10),
  })),
  { label: "Lavage extérieur seul", base: 49 },
];

/** Prix auto = base prestation + supplément véhicule. null si combinaison
 *  inconnue (ex. job Maison importé → prix saisi à la main). */
function autoPrice(prestation: string | null, vehicle: string | null): number | null {
  const p = PRESTATIONS.find((x) => x.label === prestation);
  const v = VEHICLE_TYPES.find((x) => x.label === vehicle);
  if (!p || !v) return null;
  return p.base + v.surcharge;
}

/** Options d'un select en préservant une valeur existante hors-liste
 *  (jobs importés, anciennes valeurs). */
function withCurrent(standard: string[], current: string | null): string[] {
  return current && !standard.includes(current) ? [current, ...standard] : standard;
}

// ─── Stats (tableau de bord) ───────────────────────────────────────────────
type Group = { key: string; count: number; total: number };
function groupSum(items: Job[], keyFn: (j: Job) => string): Group[] {
  const m = new Map<string, Group>();
  for (const j of items) {
    const k = keyFn(j);
    const cur = m.get(k) ?? { key: k, count: 0, total: 0 };
    cur.count += 1;
    cur.total += j.total;
    m.set(k, cur);
  }
  return [...m.values()].sort((a, b) => b.total - a.total);
}
/** CA et compteurs calculés sur les jobs TERMINÉS (le CA n'inclut pas les
 *  jobs « à faire »). */
function computeStats(jobs: Job[]) {
  const done = jobs.filter((j) => j.status === "termine");
  const ca = done.reduce((s, j) => s + j.total, 0);
  const count = done.length;
  const now = new Date();
  const caMonth = done
    .filter((j) => {
      const d = new Date(j.ts);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, j) => s + j.total, 0);
  return {
    ca,
    count,
    avg: count ? Math.round(ca / count) : 0,
    caMonth,
    byPrestation: groupSum(done, (j) => j.prestation || "—"),
    bySource: groupSum(done, (j) => j.source || "—"),
    byPayment: groupSum(done, (j) => j.payment || "—"),
  };
}


// ─── Helpers date ────────────────────────────────────────────────────────
function tsToDateInput(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function dateInputToTs(s: string): number {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1, 9, 0, 0).getTime();
}
function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
/** En-tête de groupe de la liste : Aujourd'hui / Demain / Hier / date. */
function dayLabel(ts: number): string {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Demain";
  if (diff === -1) return "Hier";
  return new Date(ts).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

type Draft = Omit<Job, "id" | "created_at" | "booking_id"> & {
  id?: number;
  booking_id?: number | null;
};

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
// Durée estimée par prestation (min) — pour occuper l'agenda sur un RDV manuel.
// On s'appuie sur le moteur de réservation (source unique) pour rester
// synchronisé avec les créneaux en ligne ; PRESTATION_DUR ne couvre que les
// prestations qui ne sont pas des formules réservables (ex. extérieur seul).
const PRESTATION_DUR: Record<string, number> = {
  "Lavage extérieur seul": 45,
};
function prestationDuration(label: string | null): number {
  return (
    getFormulaByName(label ?? "")?.durationMin ??
    PRESTATION_DUR[label ?? ""] ??
    90
  );
}
// Combine un jour (ts) + une heure "HH:MM" en timestamp précis.
function combineTs(ts: number, time: string): number {
  const d = new Date(ts);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime();
}

function emptyDraft(): Draft {
  return {
    ts: Date.now(),
    phone: "",
    prestation: "",
    vehicle_type: "",
    price: 0,
    supplements: 0,
    total: 0,
    collected: 0,
    payment: "",
    source: "",
    status: "a_faire",
    notes: "",
    scheduled_at: null,
    duration_min: null,
    customer_name: "",
    email: "",
    address: "",
    lead_id: null,
  };
}

export default function JobsApp({
  initialJobs,
  initialLeads,
}: {
  initialJobs: Job[];
  initialLeads: Lead[];
}) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<string>("a_faire");
  const [leadFilter, setLeadFilter] = useState<string>("nouveau");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null); // null = aucun form ouvert
  const [view, setView] = useState<"jobs" | "prospects" | "stats">("jobs");
  const [refreshing, setRefreshing] = useState(false);
  const [pull, setPull] = useState(0); // tirer-pour-actualiser (px)
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { a_faire: 0, termine: 0 };
    for (const j of jobs) c[j.status] = (c[j.status] ?? 0) + 1;
    return c;
  }, [jobs]);

  const visible = useMemo(() => {
    const base = filter === "tous" ? jobs : jobs.filter((j) => j.status === filter);
    // Vue « à faire » = agenda → tri chronologique (heure de RDV si présente).
    if (filter === "a_faire") {
      return [...base].sort(
        (a, b) => (a.scheduled_at ?? a.ts) - (b.scheduled_at ?? b.ts),
      );
    }
    return base;
  }, [jobs, filter]);
  const stats = useMemo(() => computeStats(jobs), [jobs]);
  // Regroupe la liste visible par jour (liste déjà triée par date desc).
  const grouped = useMemo(() => {
    const groups: { label: string; jobs: Job[] }[] = [];
    for (const job of visible) {
      const label = dayLabel(job.ts);
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.jobs.push(job);
      else groups.push({ label, jobs: [job] });
    }
    return groups;
  }, [visible]);

  // Compteurs + liste filtrée des prospects.
  const leadCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);
  const visibleLeads = useMemo(
    () =>
      leadFilter === "tous"
        ? leads
        : leads.filter((l) => l.status === leadFilter),
    [leads, leadFilter],
  );

  // Recharge jobs + prospects depuis le serveur.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [jr, lr] = await Promise.all([
        fetch("/api/equipe/jobs"),
        fetch("/api/equipe/leads"),
      ]);
      const jd = (await jr.json()) as { ok?: boolean; jobs?: Job[] };
      if (jd.ok && Array.isArray(jd.jobs)) setJobs(jd.jobs);
      const ld = (await lr.json()) as { ok?: boolean; leads?: Lead[] };
      if (ld.ok && Array.isArray(ld.leads)) setLeads(ld.leads);
    } catch {
      /* hors-ligne : on garde les données affichées */
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Actualisation auto quand l'app revient au premier plan (le confort #1 :
  // plus besoin de quitter pour voir les nouveaux jobs/devis).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  // Tirer-pour-actualiser (uniquement vue Jobs, en haut de liste, form fermé).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let startY = 0;
    let active = false;
    let current = 0;
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !draft && view === "jobs") {
        startY = e.touches[0].clientY;
        active = true;
        setDragging(true);
      }
    };
    const onMove = (e: TouchEvent) => {
      if (!active) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0 && window.scrollY <= 0) {
        e.preventDefault();
        current = Math.min(dy * 0.45, 80);
        setPull(current);
      } else {
        active = false;
        setDragging(false);
        setPull(0);
      }
    };
    const onEnd = () => {
      if (!active) return;
      active = false;
      setDragging(false);
      if (current >= 55) refresh();
      current = 0;
      setPull(0);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [refresh, draft, view]);

  async function logout() {
    await fetch("/api/equipe/logout", { method: "POST" });
    window.location.reload();
  }

  // Sauvegarde (création ou édition)
  async function save(d: Draft) {
    const payload = {
      ...d,
      total: d.price + d.supplements,
      // Encaissé déduit du statut : terminé = encaissé, à faire = non.
      collected: d.status === "termine" ? 1 : 0,
    };
    if (d.id) {
      await fetch("/api/equipe/jobs", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === d.id ? ({ ...j, ...payload } as Job) : j)),
      );
    } else {
      const res = await fetch("/api/equipe/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: number };
      if (data.id) {
        setJobs((prev) => [
          { ...(payload as Job), id: data.id!, created_at: Date.now(), booking_id: null },
          ...prev,
        ]);
      }
    }
    setDraft(null);
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce job ?")) return;
    await fetch("/api/equipe/jobs", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDraft(null);
  }

  // Changement de statut rapide (depuis la carte)
  async function cycleStatus(job: Job) {
    const next = job.status === "termine" ? "a_faire" : "termine";
    const collected = next === "termine" ? 1 : 0;
    await fetch("/api/equipe/jobs", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: job.id, status: next, collected }),
    });
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: next, collected } : j,
      ),
    );
  }

  // Change le statut d'un prospect (optimiste).
  async function setLeadStatus(lead: Lead, status: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status } : l)),
    );
    await fetch("/api/equipe/leads", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: lead.id, status }),
    });
  }

  // « Converti » : marque le prospect converti ET ouvre un job pré-rempli
  // (téléphone + nom) → le pont prospect → client en un geste.
  function convertLead(lead: Lead) {
    setLeadStatus(lead, "converti");
    setDraft({
      ...emptyDraft(),
      phone: lead.phone ?? "",
      source: "Meta Ads",
      notes: lead.full_name ? `Prospect : ${lead.full_name}` : "",
    });
  }

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch("/api/equipe/blocks");
      const data = (await res.json()) as { ok?: boolean; blocks?: Block[] };
      if (data.ok && Array.isArray(data.blocks)) setBlocks(data.blocks);
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  async function addBlock(start_at: number, end_at: number, reason: string) {
    await fetch("/api/equipe/blocks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ start_at, end_at, reason }),
    });
    fetchBlocks();
  }
  async function removeBlock(id: number) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    await fetch("/api/equipe/blocks", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-slate-50 pb-24">
      {/* Barre du haut */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <p className="h-display text-lg font-bold text-slate-900">
            Stras<span className="text-brand-600">Clean</span>{" "}
            <span className="text-sm font-semibold text-slate-400">Équipe</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refresh()}
              aria-label="Actualiser"
              className="grid h-9 w-9 place-items-center rounded-full text-xl text-slate-500 active:bg-slate-100"
            >
              <span className={`inline-block ${refreshing ? "animate-spin" : ""}`}>
                ↻
              </span>
            </button>
            <button
              onClick={logout}
              className="text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Zone « tirer pour actualiser » (sa hauteur suit le geste) */}
      <div
        className={`flex items-end justify-center overflow-hidden text-xs font-semibold text-slate-400 ${
          dragging ? "" : "transition-[height] duration-200"
        }`}
        style={{ height: refreshing ? 40 : pull }}
      >
        <span className="pb-2">
          {refreshing
            ? "Actualisation…"
            : pull >= 55
              ? "Relâchez pour actualiser ↑"
              : pull > 0
                ? "Tirez pour actualiser ↓"
                : ""}
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-3">
        {/* Bascule Jobs / Prospects / Stats */}
        <div className="mb-3 flex gap-1.5">
          {[
            { id: "jobs" as const, label: "Jobs" },
            {
              id: "prospects" as const,
              label: `Prospects${leadCounts.nouveau ? ` · ${leadCounts.nouveau}` : ""}`,
            },
            { id: "stats" as const, label: "Stats" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-bold transition ${
                view === v.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {view === "stats" ? (
          <Dashboard stats={stats} />
        ) : view === "prospects" ? (
          <>
            {/* Filtres prospects */}
            <div className="sticky top-[57px] z-10 -mx-4 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5 overflow-x-auto">
                {[
                  { id: "nouveau", label: `Nouveaux (${leadCounts.nouveau ?? 0})` },
                  { id: "a_relancer", label: `À relancer (${leadCounts.a_relancer ?? 0})` },
                  { id: "converti", label: `Convertis (${leadCounts.converti ?? 0})` },
                  { id: "perdu", label: `Perdus (${leadCounts.perdu ?? 0})` },
                  { id: "tous", label: "Tous" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLeadFilter(t.id)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                      leadFilter === t.id
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {visibleLeads.length === 0 ? (
              <p className="mt-12 text-center text-sm text-slate-400">
                Aucun prospect ici.
              </p>
            ) : (
              <ul className="mt-2 space-y-2.5">
                {visibleLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onStatus={(s) => setLeadStatus(lead, s)}
                    onConvert={() => convertLead(lead)}
                  />
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            {/* Filtres */}
            <div className="sticky top-[57px] z-10 -mx-4 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5 overflow-x-auto">
                {[
                  { id: "a_faire", label: `À faire (${counts.a_faire})` },
                  { id: "termine", label: `Terminé (${counts.termine})` },
                  { id: "tous", label: "Tous" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilter(t.id)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                      filter === t.id
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste groupée par jour */}
            {visible.length === 0 ? (
              <p className="mt-12 text-center text-sm text-slate-400">
                Aucun job ici.
              </p>
            ) : (
              <div className="mt-2 space-y-5">
                {grouped.map((g) => (
                  <div key={g.label}>
                    <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                      {g.label}
                    </p>
                    <ul className="space-y-2.5">
                      {g.jobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onOpen={() => setDraft({ ...job })}
                          onStatus={() => cycleStatus(job)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <BlocksManager
              blocks={blocks}
              onAdd={addBlock}
              onRemove={removeBlock}
            />
          </>
        )}
      </div>

      {/* Bouton flottant nouveau job (vue Jobs uniquement) */}
      {view === "jobs" && (
        <button
          onClick={() => setDraft(emptyDraft())}
          className="fixed bottom-5 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95"
        >
          + Nouveau job
        </button>
      )}

      {/* Formulaire (création / édition) */}
      {draft && (
        <JobForm
          draft={draft}
          onClose={() => setDraft(null)}
          onSave={save}
          onDelete={draft.id ? () => remove(draft.id!) : undefined}
        />
      )}
    </div>
  );
}

// ─── Carte job ─────────────────────────────────────────────────────────────
function JobCard({
  job,
  onOpen,
  onStatus,
}: {
  job: Job;
  onOpen: () => void;
  onStatus: () => void;
}) {
  const done = job.status === "termine";
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-bold text-slate-900">
            {job.scheduled_at ? (
              <span className="text-brand-700">{fmtTime(job.scheduled_at)} · </span>
            ) : null}
            {job.prestation || "Job"}
            {job.vehicle_type ? (
              <span className="font-normal text-slate-500"> · {job.vehicle_type}</span>
            ) : null}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {job.customer_name ? `${job.customer_name} · ` : ""}
            {fmtDate(job.ts)}
            {job.source ? ` · ${job.source}` : ""}
          </p>
        </button>
        {job.total > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-slate-900">{job.total} €</p>
            {done && job.payment ? (
              <p className="text-[11px] text-slate-400">{job.payment}</p>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
        <div className="flex min-w-0 items-center gap-3">
          {job.phone ? (
            <a
              href={`tel:${job.phone.replace(/[^0-9+]/g, "")}`}
              className="truncate text-xs font-semibold text-brand-700"
            >
              📞 {job.phone}
            </a>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
          {job.email ? (
            <span
              title={`Avis Google auto : ${job.email}`}
              className="shrink-0 text-xs text-slate-400"
            >
              ✉️
            </span>
          ) : null}
        </div>
        {/* Validation rapide directement sur la carte (sans ouvrir le form) */}
        {done ? (
          <button
            onClick={onStatus}
            className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800 active:scale-95"
            title="Annuler (repasser à faire)"
          >
            ✓ Terminé
          </button>
        ) : (
          <button
            onClick={onStatus}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white shadow-sm active:scale-95"
          >
            ✓ Terminer
          </button>
        )}
      </div>
    </li>
  );
}

// ─── Carte prospect ────────────────────────────────────────────────────────
function LeadCard({
  lead,
  onStatus,
  onConvert,
}: {
  lead: Lead;
  onStatus: (status: string) => void;
  onConvert: () => void;
}) {
  const st = LEAD_STATUSES.find((s) => s.id === lead.status);
  const tel = lead.phone ? lead.phone.replace(/[^0-9+]/g, "") : "";
  const wa = tel ? `https://wa.me/${tel.replace(/^\+/, "")}` : "";
  const srcLabel = lead.source === "meta_ads" ? "Meta Ads" : lead.source;
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">
            {lead.full_name || "Prospect"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {fmtDate(lead.ts)}
            {srcLabel ? ` · ${srcLabel}` : ""}
          </p>
        </div>
        {st && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${st.cls}`}
          >
            {st.label}
          </span>
        )}
      </div>

      {/* Contact rapide */}
      <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
        {lead.phone && (
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 active:scale-95"
          >
            📞 {lead.phone}
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 font-semibold text-brand-700 active:scale-95"
          >
            💬 WhatsApp
          </a>
        )}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-600 active:scale-95"
          >
            ✉️ Email
          </a>
        )}
      </div>

      {/* Résultat de l'appel */}
      <div className="mt-2.5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-2.5">
        <button
          onClick={onConvert}
          className="rounded-xl bg-brand-600 px-2 py-2.5 text-xs font-bold text-white active:scale-95"
        >
          ✅ Converti
        </button>
        <button
          onClick={() => onStatus("a_relancer")}
          className="rounded-xl bg-amber-100 px-2 py-2.5 text-xs font-bold text-amber-800 active:scale-95"
        >
          🔁 Relancer
        </button>
        <button
          onClick={() => onStatus("perdu")}
          className="rounded-xl bg-slate-100 px-2 py-2.5 text-xs font-bold text-slate-500 active:scale-95"
        >
          ❌ Perdu
        </button>
      </div>
    </li>
  );
}

// ─── Indisponibilités (congés / créneaux bloqués) ─────────────────────────
function BlocksManager({
  blocks,
  onAdd,
  onRemove,
}: {
  blocks: Block[];
  onAdd: (start: number, end: number, reason: string) => void;
  onRemove: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("20:00");
  const [reason, setReason] = useState("");

  function add() {
    if (!date) return;
    const start = combineTs(dateInputToTs(date), from);
    const end = combineTs(dateInputToTs(date), to);
    if (end <= start) return;
    onAdd(start, end, reason);
    setReason("");
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-slate-600"
      >
        🚫 Indisponibilités{blocks.length > 0 ? ` (${blocks.length})` : ""}
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-slate-100 px-4 py-4">
          <p className="text-xs text-slate-500">
            Bloque un jour / créneau (congé, perso…) → il disparaît des
            disponibilités de réservation.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
            <input
              type="time"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputCls}
            />
            <input
              type="time"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={inputCls}
            />
          </div>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motif (facultatif)"
            className={inputCls}
          />
          <button
            onClick={add}
            disabled={!date}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            Bloquer ce créneau
          </button>

          {blocks.length > 0 && (
            <ul className="space-y-2 pt-1">
              {blocks.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="truncate text-slate-700">
                    {fmtDate(b.start_at)} · {fmtTime(b.start_at)}–
                    {fmtTime(b.end_at)}
                    {b.reason ? ` · ${b.reason}` : ""}
                  </span>
                  <button
                    onClick={() => onRemove(b.id)}
                    aria-label="Supprimer"
                    className="shrink-0 text-slate-400 active:scale-90"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Formulaire job (plein écran mobile) ───────────────────────────────────
function JobForm({
  draft,
  onClose,
  onSave,
  onDelete,
}: {
  draft: Draft;
  onClose: () => void;
  onSave: (d: Draft) => void;
  onDelete?: () => void;
}) {
  const [d, setD] = useState<Draft>(draft);
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState<string>(
    draft.scheduled_at ? new Date(draft.scheduled_at).toTimeString().slice(0, 5) : "",
  );
  const [showDetails, setShowDetails] = useState(
    () => !!(draft.phone || draft.notes || draft.customer_name),
  );
  const total = d.price + d.supplements;

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }
  // Prestation/véhicule recalculent le prix automatiquement (si combinaison
  // connue). Le prix reste éditable ensuite (cas Maison / sur-mesure).
  function setPrestation(label: string) {
    setD((prev) => {
      const ap = autoPrice(label, prev.vehicle_type);
      return { ...prev, prestation: label, ...(ap != null ? { price: ap } : {}) };
    });
  }
  function setVehicle(label: string) {
    setD((prev) => {
      const ap = autoPrice(prev.prestation, label);
      return { ...prev, vehicle_type: label, ...(ap != null ? { price: ap } : {}) };
    });
  }

  async function submit() {
    setSaving(true);
    const scheduled_at = time ? combineTs(d.ts, time) : null;
    const duration_min = scheduled_at ? prestationDuration(d.prestation) : null;
    await onSave({ ...d, scheduled_at, duration_min });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <button onClick={onClose} className="text-sm font-medium text-slate-500">
          Annuler
        </button>
        <p className="text-sm font-bold text-slate-900">
          {d.id ? "Modifier le job" : "Nouveau job"}
        </p>
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input
                type="date"
                value={tsToDateInput(d.ts)}
                onChange={(e) => set("ts", dateInputToTs(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Heure (RDV)">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          {time && (
            <p className="-mt-1 text-xs text-slate-500">
              Bloque l'agenda&nbsp;: {prestationDuration(d.prestation)} min de
              prestation + {BOOKING_CONFIG.bufferMin} min de trajet avant/après.
            </p>
          )}

          <Field label="Prestation">
            <select
              value={d.prestation ?? ""}
              onChange={(e) => setPrestation(e.target.value)}
              className={inputCls}
            >
              <option value="">—</option>
              {withCurrent(
                PRESTATIONS.map((p) => p.label),
                d.prestation,
              ).map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Type de véhicule">
            <select
              value={d.vehicle_type ?? ""}
              onChange={(e) => setVehicle(e.target.value)}
              className={inputCls}
            >
              <option value="">—</option>
              {withCurrent(
                VEHICLE_TYPES.map((v) => v.label),
                d.vehicle_type,
              ).map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix (€)">
              <input
                type="number"
                inputMode="numeric"
                value={d.price || ""}
                onChange={(e) => set("price", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
            <Field label="Suppléments (€)">
              <input
                type="number"
                inputMode="numeric"
                value={d.supplements || ""}
                onChange={(e) => set("supplements", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">Total</span>
              <span className="h-display text-2xl font-bold">{total} €</span>
            </div>
          </div>

          <Field label="Paiement">
            <select
              value={d.payment ?? ""}
              onChange={(e) => set("payment", e.target.value)}
              className={inputCls}
            >
              <option value="">—</option>
              {PAYMENTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Statut">
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set("status", s.id)}
                  className={`rounded-xl px-2 py-3 text-sm font-bold transition ${
                    d.status === s.id
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Détails facultatifs repliés — allège l'écran pour les nettoyeurs */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-slate-600"
            >
              Détails (facultatif)
              <span className="text-slate-400">{showDetails ? "▲" : "▼"}</span>
            </button>
            {showDetails && (
              <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                <Field label="Nom du client">
                  <input
                    value={d.customer_name ?? ""}
                    onChange={(e) => set("customer_name", e.target.value)}
                    placeholder="Prénom Nom"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email (avis Google auto à la fin du job)">
                  <input
                    type="email"
                    inputMode="email"
                    value={d.email ?? ""}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="client@email.fr"
                    className={inputCls}
                  />
                </Field>
                <Field label="Téléphone">
                  <input
                    type="tel"
                    inputMode="tel"
                    value={d.phone ?? ""}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="06 12 34 56 78"
                    className={inputCls}
                  />
                </Field>
                <Field label="Source du lead">
                  <select
                    value={d.source ?? ""}
                    onChange={(e) => set("source", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">—</option>
                    {withCurrent(SOURCES, d.source).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Notes">
                  <textarea
                    value={d.notes ?? ""}
                    onChange={(e) => set("notes", e.target.value)}
                    rows={3}
                    placeholder="Accès, état, remarques…"
                    className={inputCls}
                  />
                </Field>
              </div>
            )}
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
            >
              Supprimer ce job
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// text-base (16px) volontaire : empêche le zoom auto d'iOS au focus + plus
// lisible/cliquable au doigt. py-3 pour de plus grandes cibles tactiles.
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 outline-none focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

// ─── Tableau de bord ───────────────────────────────────────────────────────
function Dashboard({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const maxPrest = Math.max(1, ...stats.byPrestation.map((g) => g.total));
  return (
    <div className="space-y-3.5 pb-10">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard label="Chiffre d'affaires" value={`${stats.ca} €`} accent />
        <StatCard label="Prestations" value={String(stats.count)} />
        <StatCard label="Panier moyen" value={`${stats.avg} €`} />
        <StatCard label="CA ce mois-ci" value={`${stats.caMonth} €`} />
      </div>

      {stats.count === 0 ? (
        <p className="pt-6 text-center text-sm text-slate-400">
          Aucune prestation terminée pour l'instant.
        </p>
      ) : (
        <>
          {/* Répartition par prestation (avec barres) */}
          <Panel title="Par prestation">
            {stats.byPrestation.map((g) => (
              <div key={g.key} className="mb-3 last:mb-0">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-slate-800">{g.key}</span>
                  <span className="text-slate-500">
                    {g.count}× ·{" "}
                    <strong className="text-slate-900">{g.total} €</strong>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(g.total / maxPrest) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </Panel>

          {/* Sources + paiements */}
          <div className="grid grid-cols-2 gap-2.5">
            <Panel title="Par source">
              {stats.bySource.map((g) => (
                <Row key={g.key} label={g.key} value={`${g.count}× · ${g.total} €`} />
              ))}
            </Panel>
            <Panel title="Par paiement">
              {stats.byPayment.map((g) => (
                <Row key={g.key} label={g.key} value={`${g.count}× · ${g.total} €`} />
              ))}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3.5 ${
        accent ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`h-display mt-1 text-2xl font-bold ${
          accent ? "text-brand-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 text-sm">
      <span className="truncate text-slate-700">{label}</span>
      <span className="shrink-0 text-xs font-medium text-slate-500">{value}</span>
    </div>
  );
}
