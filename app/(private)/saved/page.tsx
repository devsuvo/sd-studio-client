"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import StudioCard, { StudioCardSkeleton } from "@/components/studio-card";
import { EmptyState, ErrorState, PageHeader } from "@/components/ui";
import { useWishlist } from "@/components/wishlist";
import { useFetch } from "@/hooks/use-fetch";
import type { Studio } from "@/lib/types";

export default function SavedStudiosPage() {
  const { data, error, loading, reload } = useFetch<{ ids: string[]; studios: Studio[] }>("/api/wishlist", { auth: true });
  const { saved } = useWishlist();
  // Hide cards the user un-hearts on this page without refetching.
  const studios = (data?.studios ?? []).filter((s) => saved.has(s._id));

  return (
    <div>
      <PageHeader title="Saved Studios" subtitle="Spaces you've hearted for later." />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved studios yet"
          message="Tap the heart on any studio card to keep it here for your next project."
          action={
            <Link href="/studios" className="btn btn-primary btn-sm">
              Explore Studios
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {studios.map((s) => (
            <StudioCard key={s._id} studio={s} />
          ))}
        </div>
      )}
    </div>
  );
}
