import { NextRequest, NextResponse } from "next/server";
import { listJobsForReviewDrip, markReviewStep } from "@/lib/db";
import { sendReviewRequest, REVIEW_DAYS, REVIEW_GRACE } from "@/lib/reviewEmail";

// Relances « avis Google » après un job terminé (J+3, J+6). Le J0 part
// automatiquement quand l'équipe marque le job « terminé ». À appeler
// ~toutes les heures : GET /api/reservation/review-drip?key=<META_POLL_SECRET>
//
// Au plus un email par job et par passage. Idempotent (review_step).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.META_POLL_SECRET;
const DAY = 86400000;

export async function GET(req: NextRequest) {
  if (!SECRET || req.nextUrl.searchParams.get("key") !== SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const now = Date.now();
  const jobs = listJobsForReviewDrip(REVIEW_DAYS.length);
  let sent = 0;
  let skipped = 0;

  for (const job of jobs) {
    if (!job.completed_at) continue;
    let step = job.review_step;
    while (step < REVIEW_DAYS.length) {
      const dueAt = job.completed_at + REVIEW_DAYS[step] * DAY;
      if (now < dueAt) break; // pas encore l'heure
      if (now - dueAt > REVIEW_GRACE[step] * DAY) {
        markReviewStep(job.id, step + 1); // étape ratée → on saute
        step++;
        skipped++;
        continue;
      }
      const ok = await sendReviewRequest(job, step);
      if (ok) {
        markReviewStep(job.id, step + 1);
        sent++;
      }
      break; // un seul email par job et par passage
    }
  }

  return NextResponse.json({ ok: true, candidates: jobs.length, sent, skipped });
}
