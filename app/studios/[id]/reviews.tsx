"use client";

import { MessageSquareText, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui";
import UserAvatar from "@/components/user-avatar";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Review, Studio } from "@/lib/types";

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= value ? "fill-warning text-warning" : "text-base-content/25"}`} />
      ))}
    </span>
  );
}

export default function Reviews({ studio, onChange }: { studio: Studio; onChange: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: reviews, loading, reload } = useFetch<Review[]>(`/api/studios/${studio._id}/reviews`);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const isOwner = session?.user.email === studio.ownerEmail;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters about your session.");
      return;
    }
    setSaving(true);
    try {
      await api(`/api/studios/${studio._id}/reviews`, { method: "POST", auth: true, body: { rating, comment } });
      toast.success("Thanks! Your review is posted.");
      setComment("");
      reload();
      onChange();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {studio.reviewCount > 0 && (
          <span className="flex items-center gap-2 text-sm text-base-content/70">
            <Stars value={Math.round(studio.rating)} /> {studio.rating.toFixed(1)} · {studio.reviewCount} review
            {studio.reviewCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          Array.from({ length: 2 }, (_, i) => <div key={i} className="skeleton h-24 w-full" />)
        ) : !reviews?.length ? (
          <EmptyState
            icon={MessageSquareText}
            title="No reviews yet"
            message="Creators who book this studio can share how their session went."
          />
        ) : (
          reviews.map((r) => (
            <article key={r._id} className="rounded-box border border-base-300 p-5">
              <div className="flex items-center gap-3">
                <UserAvatar name={r.userName} image={r.userImage} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{r.userName}</p>
                  <p className="text-xs text-base-content/60">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="mt-3 leading-relaxed text-base-content/80">{r.comment}</p>
            </article>
          ))
        )}
      </div>

      {!isOwner &&
        (session ? (
          <form onSubmit={submit} className="mt-6 rounded-box border border-base-300 bg-base-200/40 p-5">
            <h3 className="font-semibold">Booked this studio? Leave a review</h3>
            <div className="rating mt-3" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <input
                  key={n}
                  type="radio"
                  name="rating"
                  className="mask mask-star-2 bg-warning"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                />
              ))}
            </div>
            <textarea
              className="textarea mt-3 w-full"
              rows={3}
              maxLength={1000}
              placeholder="How was the space, the gear and the host?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-primary btn-sm mt-3" disabled={saving}>
              {saving && <span className="loading loading-spinner loading-xs" />}
              Post review
            </button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-base-content/70">
            <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="link link-primary">
              Log in
            </Link>{" "}
            to review a studio you&apos;ve booked.
          </p>
        ))}
    </section>
  );
}
