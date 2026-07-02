import type { Metadata } from "next";
import Header from "@/components/Header";
import ReservationManage from "@/components/ReservationManage";
import { getJob } from "@/lib/db";
import { checkResaToken } from "@/lib/reservationEmail";
import { getFormulaByName, BOOKING_CONFIG } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ma réservation — StrasClean",
  robots: { index: false, follow: false },
};

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id: idStr } = await params;
  const { t } = await searchParams;
  const id = Number(idStr) || 0;

  const valid = id > 0 && !!t && checkResaToken(id, t);
  const job = valid ? getJob(id) : null;

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-slate-50">
        <div className="container-x max-w-lg py-10">{children}</div>
      </main>
    </>
  );

  if (!valid || !job || !job.scheduled_at) {
    return (
      <Shell>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft">
          <p className="text-3xl">🔒</p>
          <h1 className="h-display mt-2 text-xl font-bold text-slate-900">
            Lien invalide ou expiré
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ce lien de gestion n'est plus valable. Contactez-nous et on s'occupe
            de tout.
          </p>
        </div>
      </Shell>
    );
  }

  const formula = getFormulaByName(job.prestation ?? "");
  const when = new Date(job.scheduled_at).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const canModify =
    job.status !== "annule" &&
    job.scheduled_at - Date.now() >= BOOKING_CONFIG.cancelHoursBefore * 3600000;

  return (
    <Shell>
      <ReservationManage
        id={job.id}
        token={t!}
        formulaId={formula?.id ?? ""}
        service={[job.prestation, job.vehicle_type].filter(Boolean).join(" · ")}
        when={when}
        price={job.total ?? job.price ?? 0}
        address={job.address ?? null}
        status={job.status === "annule" ? "annule" : "a_faire"}
        canModify={canModify}
        cancelHours={BOOKING_CONFIG.cancelHoursBefore}
      />
    </Shell>
  );
}
