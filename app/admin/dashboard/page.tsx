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
} from "@/lib/db";
import { getGooglePlaceData } from "@/lib/reviews";
import LogoutButton from "./LogoutButton";
import { HideIpButton, UnhideIpButton } from "./HideIpButton";
import ReviewTagger from "./ReviewTagger";

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
    ads: { label: "Ads", cls: "bg-amber-500/15 text-amber-200 border-amber-500/30" },
    organic: { label: "Organic", cls: "bg-brand-500/15 text-brand-200 border-brand-500/30" },
    direct: { label: "Direct", cls: "bg-white/10 text-white/70 border-white/15" },
    referral: { label: "Referral", cls: "bg-sky-500/15 text-sky-200 border-sky-500/30" },
    social: { label: "Social", cls: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30" },
  };
  const m = map[src ?? ""] ?? { label: src ?? "?", cls: "bg-white/5 text-white/65 border-white/10" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${m.cls}`}>
      {m.label}
    </span>
  );
}

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

  return (
    <div className="container-x py-8">
      {/* Top bar */}
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="h-display text-2xl font-bold sm:text-3xl">Dashboard StrasClean</h1>
          <p className="mt-1 text-sm text-white/60">
            Trafic, sources, clics de contact. Données 100% server-side, hors Google Ads.
            {hiddenIps.length > 0 && (
              <span className="ml-2 text-amber-300/80">
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

      {/* KPIs */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Visites 24h" value={k.visits24h} />
        <Kpi label="Visites 7j" value={k.visits7d} hint={`${k.visits30d} sur 30j`} />
        <Kpi label="Clics WhatsApp 7j" value={k.whatsappClicks7d} hint={`${k.whatsappClicksTotal} au total`} tone="brand" />
        <Kpi label="Clics téléphone 7j" value={k.phoneClicks7d} hint={`${k.phoneClicksTotal} au total`} tone="brand" />
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

      {/* Sources 7j */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Ads 7j" value={k.visitsAds7d} tone="amber" />
        <Kpi label="Organic 7j" value={k.visitsOrganic7d} tone="brand" />
        <Kpi label="Direct 7j" value={k.visitsDirect7d} />
        <Kpi label="Référents 7j" value={k.visitsReferral7d} tone="sky" />
      </section>

      {/* Top paths + Top referers */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Pages les plus visitées (30j)">
          <ul className="divide-y divide-white/5">
            {topPaths.length === 0 && <li className="py-4 text-sm text-white/50">Aucune donnée encore.</li>}
            {topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-4 py-2.5">
                <span className="truncate text-sm text-white/85">{p.path}</span>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80">
                  {p.c}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Sources externes (30j)">
          <ul className="divide-y divide-white/5">
            {topReferers.length === 0 && <li className="py-4 text-sm text-white/50">Aucune donnée encore.</li>}
            {topReferers.map((r) => (
              <li key={r.referer} className="flex items-center justify-between gap-4 py-2.5">
                <span className="truncate text-sm text-white/85" title={r.referer}>
                  {r.referer}
                </span>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80">
                  {r.c}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* IPs cachées */}
      {hiddenIps.length > 0 && (
        <section className="mt-8">
          <Panel title={`IPs masquées (${hiddenIps.length})`}>
            <p className="mb-3 text-xs text-white/65">
              Toutes les visites/clics de ces IPs sont exclus des statistiques affichées ci-dessus.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {hiddenIps.map((h) => (
                <li
                  key={h.ip}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-white/85">{h.ip}</p>
                    {h.label && (
                      <p className="truncate text-[11px] text-white/50">{h.label}</p>
                    )}
                  </div>
                  <UnhideIpButton ip={h.ip} />
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      )}

      {/* Tagger les avis Google par section (Auto / Maison / Les deux) */}
      <section className="mt-8">
        <Panel
          title={`Avis Google — tagger par section (${reviewsForTagger.length})`}
        >
          <p className="mb-4 text-xs text-white/65">
            Chaque avis affiche par défaut côté Auto (notre activité historique).
            Tague-le <span className="text-amber-300">Maison</span> ou{" "}
            <span className="text-sky-300">Les deux</span> dès qu'il concerne le
            mobilier. Le filtre s'applique en temps réel sur le site.
          </p>
          {reviewsForTagger.length === 0 ? (
            <p className="text-sm text-white/50">
              Aucun avis Google récupéré pour l'instant (vérifie ta config
              Places API).
            </p>
          ) : (
            <ReviewTagger reviews={reviewsForTagger} tags={reviewTags} />
          )}
        </Panel>
      </section>

      {/* Visites récentes */}
      <section className="mt-8">
        <Panel
          title={`Visites récentes — page ${visitsPage}/${visitsPages} (${visitsTotal} au total)`}
        >
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[960px] text-xs">
              <thead className="text-left text-white/65 uppercase tracking-wider">
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
              <tbody className="divide-y divide-white/5">
                {visits.length === 0 && (
                  <tr><td colSpan={8} className="py-6 text-center text-white/50">Aucune visite sur cette page.</td></tr>
                )}
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02]">
                    <td className="px-2 py-2 whitespace-nowrap text-white/75">{fmt(v.ts)}</td>
                    <td className="px-2 py-2">{sourceBadge(v.source)}</td>
                    <td className="px-2 py-2 max-w-[220px] truncate" title={v.path}>{shortPath(v.path)}</td>
                    <td className="px-2 py-2 text-white/70 max-w-[200px] truncate" title={[v.utm_source, v.utm_campaign, v.gclid].filter(Boolean).join(" · ")}>
                      {v.gclid ? <span className="text-amber-300">gclid</span> : null}
                      {v.utm_source ? <> · {v.utm_source}</> : null}
                      {v.utm_campaign ? <> · {v.utm_campaign}</> : null}
                      {!v.gclid && !v.utm_source ? "—" : null}
                    </td>
                    <td className="px-2 py-2 text-white/75">{v.device}</td>
                    <td className="px-2 py-2 text-white/75">{v.os} · {v.browser}</td>
                    <td className="px-2 py-2 text-white/65">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{v.ip ?? "—"}</span>
                        <HideIpButton ip={v.ip} />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-white/65 max-w-[200px] truncate" title={v.referer ?? ""}>{v.referer ?? "—"}</td>
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
              <thead className="text-left text-white/65 uppercase tracking-wider">
                <tr>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Page</th>
                  <th className="px-2 py-2">IP</th>
                  <th className="px-2 py-2">UA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-white/50">Aucun clic sur cette page.</td></tr>
                )}
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-white/[0.02]">
                    <td className="px-2 py-2 whitespace-nowrap text-white/75">{fmt(e.ts)}</td>
                    <td className="px-2 py-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        e.type === "whatsapp_click"
                          ? "bg-brand-500/15 text-brand-200 border-brand-500/30"
                          : "bg-sky-500/15 text-sky-200 border-sky-500/30"
                      }`}>
                        {e.type === "whatsapp_click" ? "WhatsApp" : "Téléphone"}
                      </span>
                    </td>
                    <td className="px-2 py-2 max-w-[240px] truncate" title={e.path ?? ""}>{shortPath(e.path)}</td>
                    <td className="px-2 py-2 text-white/65">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{e.ip ?? "—"}</span>
                        <HideIpButton ip={e.ip} />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-white/65 max-w-[280px] truncate" title={e.user_agent ?? ""}>{e.user_agent ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={eventsPage} total={eventsPages} param="ep" otherParam="vp" otherValue={visitsPage} />
        </Panel>
      </section>

      <p className="mt-10 text-center text-xs text-white/40">
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
    <nav className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
      <Link
        href={link(prev)}
        className={`rounded-lg border border-white/10 px-3 py-1.5 ${
          current === 1
            ? "pointer-events-none text-white/30"
            : "text-white/80 hover:bg-white/5"
        }`}
      >
        ← Précédent
      </Link>
      <span className="text-white/65">
        Page {current} / {total}
      </span>
      <Link
        href={link(next)}
        className={`rounded-lg border border-white/10 px-3 py-1.5 ${
          current === total
            ? "pointer-events-none text-white/30"
            : "text-white/80 hover:bg-white/5"
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
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "brand" | "amber" | "sky";
}) {
  const ring =
    tone === "brand"
      ? "border-brand-500/30 bg-brand-500/[0.06]"
      : tone === "amber"
        ? "border-amber-500/30 bg-amber-500/[0.06]"
        : tone === "sky"
          ? "border-sky-500/30 bg-sky-500/[0.06]"
          : "border-white/10 bg-white/[0.03]";
  return (
    <div className={`rounded-2xl border p-5 ${ring}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-white/65">{label}</p>
      <p className="mt-2 h-display text-3xl font-extrabold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/65">{hint}</p>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="h-display text-base font-semibold text-white sm:text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
