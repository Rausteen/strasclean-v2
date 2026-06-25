import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import {
  getKpis,
  getRecentVisits,
  getRecentEvents,
  countVisits,
  countEvents,
  getTopPaths,
  getTopReferers,
  getHiddenIps,
  getReviewTagsMap,
  getRecentBookingRequests,
  countBookingRequests,
  getDailySeries,
} from "@/lib/db";
import { getGooglePlaceData } from "@/lib/reviews";
import LogoutButton from "./LogoutButton";
import { HideIpButton, UnhideIpButton, AddHiddenIpForm } from "./HideIpButton";
import ReviewTagger from "./ReviewTagger";
import TrendChart from "./TrendChart";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 20;

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function shortPath(p: string | null) {
  if (!p) return "—";
  if (p.length <= 60) return p;
  return p.slice(0, 57) + "…";
}

function sourceBadge(src: string | null) {
  const map: Record<string, { label: string; cls: string }> = {
    ads: { label: "Ads", cls: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
    ai: { label: "IA", cls: "bg-violet-500/15 text-violet-700 border-violet-500/30" },
    organic: { label: "Organic", cls: "bg-brand-500/15 text-brand-700 border-brand-500/30" },
    direct: { label: "Direct", cls: "bg-slate-100 text-slate-600 border-slate-300" },
    referral: { label: "Referral", cls: "bg-sky-500/15 text-sky-700 border-sky-500/30" },
    social: { label: "Social", cls: "bg-fuchsia-500/15 text-fuchsia-700 border-fuchsia-500/30" },
  };
  const m = map[src ?? ""] ?? { label: src ?? "?", cls: "bg-slate-50 text-slate-600 border-slate-200" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${m.cls}`}>
      {m.label}
    </span>
  );
}

/** Variation en % entre la valeur courante et la précédente. null si la
 *  période précédente est vide ET la courante aussi (rien à comparer). */
function delta(cur: number, prev: number): number | null {
  if (prev === 0) return cur === 0 ? null : 100;
  return ((cur - prev) / prev) * 100;
}

const SECTIONS = [
  { id: "kpis", label: "Synthèse" },
  { id: "tendances", label: "Tendances" },
  { id: "sources", label: "Sources" },
  { id: "leads", label: "Leads" },
  { id: "avis", label: "Avis" },
  { id: "journal", label: "Journal" },
];

function parsePage(v: string | string[] | undefined): number {
  if (!v) return 1;
  const s = Array.isArray(v) ? v[0] : v;
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ vp?: string; ep?: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const sp = await searchParams;
  const visitsPage = parsePage(sp.vp);
  const eventsPage = parsePage(sp.ep);

  const k = getKpis();
  const visitsTotal = countVisits();
  const eventsTotal = countEvents();
  const visits = getRecentVisits(PAGE_SIZE, (visitsPage - 1) * PAGE_SIZE);
  const events = getRecentEvents(PAGE_SIZE, (eventsPage - 1) * PAGE_SIZE);
  const topPaths = getTopPaths(10);
  const topReferers = getTopReferers(10);
  const hiddenIps = getHiddenIps();

  // Avis Google + tags actuels
  const place = await getGooglePlaceData();
  const reviewTags = getReviewTagsMap();
  const reviewsForTagger = place.reviews.map((r) => ({
    id: r.id,
    author: r.author_name,
    text: r.text,
    rating: r.rating,
    relative: r.relative_time_description,
  }));

  const visitsPages = Math.max(1, Math.ceil(visitsTotal / PAGE_SIZE));
  const eventsPages = Math.max(1, Math.ceil(eventsTotal / PAGE_SIZE));

  // Demandes de RDV reçues via le formulaire /reserver-maison
  const bookingRequests = getRecentBookingRequests(20);
  const bookingTotal = countBookingRequests();

  // Série quotidienne (30j) pour le graphique de tendance
  const daily = getDailySeries(30);

  // Taux de conversion sur 7j : part des visites qui aboutissent à un
  // contact (clic WhatsApp/téléphone) ou à un lead (formulaire).
  const contacts7d = k.whatsappClicks7d + k.phoneClicks7d;
  const contactRate = k.visits7d > 0 ? (contacts7d / k.visits7d) * 100 : 0;
  const leadRate = k.visits7d > 0 ? (k.leads7d / k.visits7d) * 100 : 0;

  return (
    <div className="container-x py-8">
      {/* Top bar */}
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="h-display text-2xl font-bold sm:text-3xl">Dashboard StrasClean</h1>
          <p className="mt-1 text-sm text-slate-500">
            Trafic, sources, clics de contact. Données 100% server-side, hors Google Ads.
            {hiddenIps.length > 0 && (
              <span className="ml-2 text-amber-600/80">
                · {hiddenIps.length} IP{hiddenIps.length > 1 ? "s" : ""} masquée{hiddenIps.length > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="btn-ghost h-10 px-4 text-sm">
            ↗ Voir le site
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Navigation par ancres — collante en haut, facilite le parcours d'une
          page longue. */}
      <nav className="sticky top-0 z-20 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur sm:gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* KPIs */}
      <section id="kpis" className="scroll-mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Visites 24h" value={k.visits24h} delta={delta(k.visits24h, k.visitsPrev24h)} deltaLabel="vs 24h préc." />
        <Kpi label="Visites 7j" value={k.visits7d} hint={`${k.visits30d} sur 30j`} delta={delta(k.visits7d, k.visitsPrev7d)} deltaLabel="vs 7j préc." />
        <Kpi label="Clics WhatsApp 7j" value={k.whatsappClicks7d} hint={`${k.whatsappClicksTotal} au total`} tone="brand" delta={delta(k.whatsappClicks7d, k.whatsappPrev7d)} deltaLabel="vs 7j préc." />
        <Kpi label="Clics téléphone 7j" value={k.phoneClicks7d} hint={`${k.phoneClicksTotal} au total`} tone="brand" delta={delta(k.phoneClicks7d, k.phonePrev7d)} deltaLabel="vs 7j préc." />
      </section>

      {/* Conversions split Auto / Maison */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="WhatsApp Auto 7j"
          value={k.whatsappAuto7d}
          tone="brand"
        />
        <Kpi
          label="WhatsApp Maison 7j"
          value={k.whatsappMaison7d}
          tone="amber"
        />
        <Kpi label="Téléphone Auto 7j" value={k.phoneAuto7d} tone="brand" />
        <Kpi
          label="Téléphone Maison 7j"
          value={k.phoneMaison7d}
          tone="amber"
        />
      </section>

      {/* Tendances — graphique 30j + taux de conversion */}
      <section id="tendances" className="mt-10 scroll-mt-16">
        <h2 className="h-display mb-4 text-lg font-semibold text-slate-900">
          Tendances — 30 derniers jours
        </h2>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Panel title="Activité quotidienne">
            <TrendChart data={daily} />
          </Panel>
          <div className="grid content-start gap-3">
            <Kpi
              label="Demandes 7j"
              value={k.leads7d}
              hint={`${k.leadsTotal} au total`}
              tone="amber"
              delta={delta(k.leads7d, k.leadsPrev7d)}
              deltaLabel="vs 7j préc."
            />
            <Kpi
              label="Taux de contact 7j"
              value={contactRate}
              suffix="%"
              hint={`${contacts7d} contacts / ${k.visits7d} visites`}
              tone="sky"
            />
            <Kpi
              label="Taux de lead 7j"
              value={leadRate}
              suffix="%"
              hint={`${k.leads7d} leads / ${k.visits7d} visites`}
              tone="violet"
            />
          </div>
        </div>
      </section>

      {/* Sources 7j */}
      <section id="sources" className="mt-10 scroll-mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Ads 7j" value={k.visitsAds7d} tone="amber" />
        <Kpi label="IA 7j" value={k.visitsAi7d} tone="violet" />
        <Kpi label="Organic 7j" value={k.visitsOrganic7d} tone="brand" />
        <Kpi label="Direct 7j" value={k.visitsDirect7d} />
        <Kpi label="Référents 7j" value={k.visitsReferral7d} tone="sky" />
      </section>

      {/* Top paths + Top referers */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Pages les plus visitées (30j)">
          <ul className="divide-y divide-slate-100">
            {topPaths.length === 0 && <li className="py-4 text-sm text-slate-500">Aucune donnée encore.</li>}
            {topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-4 py-2.5">
                <span className="truncate text-sm text-slate-800">{p.path}</span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {p.c}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Sources externes (30j)">
          <ul className="divide-y divide-slate-100">
            {topReferers.length === 0 && <li className="py-4 text-sm text-slate-500">Aucune donnée encore.</li>}
            {topReferers.map((r) => (
              <li key={r.referer} className="flex items-center justify-between gap-4 py-2.5">
                <span className="truncate text-sm text-slate-800" title={r.referer}>
                  {r.referer}
                </span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {r.c}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* Demandes de RDV Maison */}
      <section id="leads" className="mt-10 scroll-mt-16">
        <Panel
          title={`Demandes de RDV Maison (${bookingTotal}${bookingTotal > 20 ? " — 20 dernières affichées" : ""})`}
        >
          {bookingRequests.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucune demande pour l'instant. Les soumissions de{" "}
              <a href="/reserver-maison" className="underline">
                /reserver-maison
              </a>{" "}
              s'afficheront ici.
            </p>
          ) : (
            <ul className="space-y-2">
              {bookingRequests.map((b) => {
                const when = new Date(b.ts).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                });
                return (
                  <li
                    key={b.id}
                    className="rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <p className="font-semibold text-slate-900">
                        {b.first_name} · {b.service_label}
                        {b.variant && (
                          <span className="font-normal text-slate-500">
                            {" "}
                            ({b.variant})
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-slate-500">{when}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                      <a
                        href={`tel:${b.phone}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        📞 {b.phone}
                      </a>
                      <a
                        href={`mailto:${b.email}`}
                        className="hover:underline"
                      >
                        ✉️ {b.email}
                      </a>
                      {b.postal_code && <span>📍 {b.postal_code}</span>}
                      {b.address_note && <span>{b.address_note}</span>}
                      {b.preferred_day && (
                        <span>
                          🗓️ {b.preferred_day}
                          {b.preferred_slot && ` (${b.preferred_slot})`}
                        </span>
                      )}
                    </div>
                    {b.notes && (
                      <p className="mt-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs italic text-slate-600">
                        {b.notes}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </section>

      {/* IPs cachées */}
      <section className="mt-8">
        <Panel title={`IPs masquées (${hiddenIps.length})`}>
          <p className="mb-3 text-xs text-slate-600">
            Toutes les visites/clics de ces IPs sont exclus des statistiques
            affichées ci-dessus. Vous pouvez masquer une IP exacte ou un{" "}
            <strong>préfixe</strong> : saisissez par ex.{" "}
            <span className="font-mono">162.158</span> pour exclure toutes les IPs
            commençant par 162.158 (utile pour les plages Cloudflare/bots).
          </p>
          <AddHiddenIpForm />
          {hiddenIps.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {hiddenIps.map((h) => (
                <li
                  key={h.ip}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-slate-800">{h.ip}</p>
                    {h.label && (
                      <p className="truncate text-[11px] text-slate-500">{h.label}</p>
                    )}
                  </div>
                  <UnhideIpButton ip={h.ip} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Aucune IP masquée pour le moment.</p>
          )}
        </Panel>
      </section>

      {/* Tagger les avis Google par section (Auto / Maison / Les deux) */}
      <section id="avis" className="mt-10 scroll-mt-16">
        <Panel
          title={`Avis Google — tagger par section (${reviewsForTagger.length})`}
        >
          <p className="mb-4 text-xs text-slate-600">
            Chaque avis affiche par défaut côté Auto (notre activité historique).
            Tague-le <span className="text-amber-600">Maison</span> ou{" "}
            <span className="text-sky-300">Les deux</span> dès qu'il concerne le
            mobilier. Le filtre s'applique en temps réel sur le site.
          </p>
          {reviewsForTagger.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucun avis Google récupéré pour l'instant (vérifie ta config
              Places API).
            </p>
          ) : (
            <ReviewTagger reviews={reviewsForTagger} tags={reviewTags} />
          )}
        </Panel>
      </section>

      {/* Visites récentes */}
      <section id="journal" className="mt-10 scroll-mt-16">
        <Panel
          title={`Visites récentes — page ${visitsPage}/${visitsPages} (${visitsTotal} au total)`}
        >
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[960px] text-xs">
              <thead className="text-left text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Source</th>
                  <th className="px-2 py-2">Page</th>
                  <th className="px-2 py-2">UTM/gclid</th>
                  <th className="px-2 py-2">Device</th>
                  <th className="px-2 py-2">OS / Browser</th>
                  <th className="px-2 py-2">IP</th>
                  <th className="px-2 py-2">Referer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visits.length === 0 && (
                  <tr><td colSpan={8} className="py-6 text-center text-slate-500">Aucune visite sur cette page.</td></tr>
                )}
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-2 py-2 whitespace-nowrap text-slate-700">{fmt(v.ts)}</td>
                    <td className="px-2 py-2">{sourceBadge(v.source)}</td>
                    <td className="px-2 py-2 max-w-[220px] truncate" title={v.path}>{shortPath(v.path)}</td>
                    <td className="px-2 py-2 text-slate-600 max-w-[200px] truncate" title={[v.utm_source, v.utm_campaign, v.gclid].filter(Boolean).join(" · ")}>
                      {v.gclid ? <span className="text-amber-600">gclid</span> : null}
                      {v.utm_source ? <> · {v.utm_source}</> : null}
                      {v.utm_campaign ? <> · {v.utm_campaign}</> : null}
                      {!v.gclid && !v.utm_source ? "—" : null}
                    </td>
                    <td className="px-2 py-2 text-slate-700">{v.device}</td>
                    <td className="px-2 py-2 text-slate-700">{v.os} · {v.browser}</td>
                    <td className="px-2 py-2 text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{v.ip ?? "—"}</span>
                        <HideIpButton ip={v.ip} />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-slate-600 max-w-[200px] truncate" title={v.referer ?? ""}>{v.referer ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={visitsPage} total={visitsPages} param="vp" otherParam="ep" otherValue={eventsPage} />
        </Panel>
      </section>

      {/* Clics récents */}
      <section className="mt-8">
        <Panel
          title={`Clics récents — WhatsApp / Téléphone — page ${eventsPage}/${eventsPages} (${eventsTotal} au total)`}
        >
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[760px] text-xs">
              <thead className="text-left text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Page</th>
                  <th className="px-2 py-2">IP</th>
                  <th className="px-2 py-2">UA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">Aucun clic sur cette page.</td></tr>
                )}
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-2 py-2 whitespace-nowrap text-slate-700">{fmt(e.ts)}</td>
                    <td className="px-2 py-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        e.type === "whatsapp_click"
                          ? "bg-brand-500/15 text-brand-700 border-brand-500/30"
                          : "bg-sky-500/15 text-sky-700 border-sky-500/30"
                      }`}>
                        {e.type === "whatsapp_click" ? "WhatsApp" : "Téléphone"}
                      </span>
                    </td>
                    <td className="px-2 py-2 max-w-[240px] truncate" title={e.path ?? ""}>{shortPath(e.path)}</td>
                    <td className="px-2 py-2 text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{e.ip ?? "—"}</span>
                        <HideIpButton ip={e.ip} />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-slate-600 max-w-[280px] truncate" title={e.user_agent ?? ""}>{e.user_agent ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={eventsPage} total={eventsPages} param="ep" otherParam="vp" otherValue={visitsPage} />
        </Panel>
      </section>

      <p className="mt-10 text-center text-xs text-slate-400">
        Stockage local SQLite — <code>data/analytics.db</code>. Mention RGPD à ajouter dans la politique de confidentialité (IP/UA conservés ~13 mois).
      </p>
    </div>
  );
}

function Pagination({
  current,
  total,
  param,
  otherParam,
  otherValue,
}: {
  current: number;
  total: number;
  param: "vp" | "ep";
  otherParam: "vp" | "ep";
  otherValue: number;
}) {
  if (total <= 1) return null;
  const link = (n: number) => `?${param}=${n}&${otherParam}=${otherValue}`;
  const prev = Math.max(1, current - 1);
  const next = Math.min(total, current + 1);

  return (
    <nav className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
      <Link
        href={link(prev)}
        className={`rounded-lg border border-slate-200 px-3 py-1.5 ${
          current === 1
            ? "pointer-events-none text-slate-300"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        ← Précédent
      </Link>
      <span className="text-slate-600">
        Page {current} / {total}
      </span>
      <Link
        href={link(next)}
        className={`rounded-lg border border-slate-200 px-3 py-1.5 ${
          current === total
            ? "pointer-events-none text-slate-300"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        Suivant →
      </Link>
    </nav>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
  suffix,
  delta,
  deltaLabel,
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "brand" | "amber" | "sky" | "violet";
  /** Suffixe collé à la valeur (ex "%"). Force aussi un affichage à 1 décimale. */
  suffix?: string;
  /** Variation en % vs période précédente (null = pas de base de comparaison). */
  delta?: number | null;
  deltaLabel?: string;
}) {
  const ring =
    tone === "brand"
      ? "border-brand-500/30 bg-brand-500/[0.06]"
      : tone === "amber"
        ? "border-amber-500/30 bg-amber-500/[0.06]"
        : tone === "sky"
          ? "border-sky-500/30 bg-sky-500/[0.06]"
          : tone === "violet"
            ? "border-violet-500/30 bg-violet-500/[0.06]"
            : "border-slate-200 bg-slate-50";
  const display = suffix === "%" ? value.toFixed(1) : value.toLocaleString("fr-FR");
  return (
    <div className={`rounded-2xl border p-5 ${ring}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="h-display text-3xl font-extrabold text-slate-900">
          {display}
          {suffix && <span className="text-xl">{suffix}</span>}
        </span>
        {delta !== undefined && <DeltaBadge delta={delta} title={deltaLabel} />}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

function DeltaBadge({ delta, title }: { delta: number | null; title?: string }) {
  if (delta === null)
    return (
      <span className="text-xs text-slate-400" title={title}>
        —
      </span>
    );
  const rounded = Math.round(delta);
  const up = rounded >= 0;
  const flat = rounded === 0;
  const cls = flat
    ? "text-slate-500"
    : up
      ? "text-brand-700"
      : "text-red-600";
  return (
    <span className={`inline-flex items-center text-xs font-semibold ${cls}`} title={title}>
      {flat ? "→" : up ? "↑" : "↓"} {Math.abs(rounded)}%
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <h2 className="h-display text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
