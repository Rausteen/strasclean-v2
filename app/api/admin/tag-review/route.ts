import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { setReviewTag, clearReviewTag } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { reviewId?: string; tag?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad body" }, { status: 400 });
  }

  const reviewId = (body.reviewId || "").trim();
  const tag = (body.tag || "").trim();
  if (!reviewId) {
    return NextResponse.json(
      { ok: false, error: "Missing reviewId" },
      { status: 400 },
    );
  }

  if (tag === "" || tag === "clear" || tag === "none") {
    clearReviewTag(reviewId);
  } else if (tag === "auto" || tag === "maison" || tag === "both") {
    setReviewTag(reviewId, tag);
  } else {
    return NextResponse.json(
      { ok: false, error: "Invalid tag" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
