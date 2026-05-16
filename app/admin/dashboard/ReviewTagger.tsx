"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Tag = "auto" | "maison" | "both" | undefined;

type Props = {
  reviews: {
    id: string;
    author: string;
    text: string;
    rating: number;
    relative?: string;
  }[];
  tags: Record<string, "auto" | "maison" | "both">;
};

export default function ReviewTagger({ reviews, tags }: Props) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {reviews.map((r) => (
        <ReviewRow key={r.id} review={r} initialTag={tags[r.id]} />
      ))}
    </ul>
  );
}

function ReviewRow({
  review,
  initialTag,
}: {
  review: Props["reviews"][number];
  initialTag: Tag;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<Tag>(initialTag);
  const [loading, setLoading] = useState(false);

  async function setTag(tag: "auto" | "maison" | "both" | "clear") {
    setLoading(true);
    const optimistic: Tag = tag === "clear" ? undefined : tag;
    setCurrent(optimistic);
    await fetch("/api/admin/tag-review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reviewId: review.id, tag }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>{review.author}</span>
            <span className="inline-flex text-amber-300 text-xs">
              {"★".repeat(review.rating)}
            </span>
            {review.relative && (
              <span className="text-[11px] font-normal text-white/45">
                · {review.relative}
              </span>
            )}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/65">
            {review.text.length > 220
              ? review.text.slice(0, 217) + "…"
              : review.text}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <TagButton
          label="Auto"
          active={current === "auto"}
          tone="brand"
          disabled={loading}
          onClick={() => setTag("auto")}
        />
        <TagButton
          label="Maison"
          active={current === "maison"}
          tone="amber"
          disabled={loading}
          onClick={() => setTag("maison")}
        />
        <TagButton
          label="Les deux"
          active={current === "both"}
          tone="sky"
          disabled={loading}
          onClick={() => setTag("both")}
        />
        {current !== undefined && (
          <button
            onClick={() => setTag("clear")}
            disabled={loading}
            className="ml-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/65 hover:border-white/25 hover:text-white/85 disabled:opacity-50"
          >
            Retirer
          </button>
        )}
        {current === undefined && (
          <span className="ml-1 text-[10px] italic text-white/40">
            Non tagué — par défaut affiché côté Auto
          </span>
        )}
      </div>
    </li>
  );
}

function TagButton({
  label,
  active,
  tone,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  tone: "brand" | "amber" | "sky";
  disabled?: boolean;
  onClick: () => void;
}) {
  const activeCls =
    tone === "brand"
      ? "bg-brand-500 text-ink-950 border-brand-500"
      : tone === "amber"
        ? "bg-amber-400 text-ink-950 border-amber-400"
        : "bg-sky-400 text-ink-950 border-sky-400";
  const idleCls =
    tone === "brand"
      ? "border-white/10 text-white/70 hover:border-brand-400/50 hover:text-brand-300"
      : tone === "amber"
        ? "border-white/10 text-white/70 hover:border-amber-400/50 hover:text-amber-300"
        : "border-white/10 text-white/70 hover:border-sky-400/50 hover:text-sky-300";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        active ? activeCls : idleCls
      }`}
    >
      {label}
    </button>
  );
}
