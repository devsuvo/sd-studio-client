"use client";

import { Eye, Pencil, Plus, Star, Trash2, Warehouse } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/confirm-dialog";
import StudioImage from "@/components/studio-image";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatHour, formatMoney } from "@/lib/format";
import type { Studio } from "@/lib/types";

export default function MyListingsPage() {
  const confirm = useConfirm();
  const { data, setData, error, loading, reload } = useFetch<Studio[]>("/api/studios/mine", { auth: true });
  const [deleting, setDeleting] = useState<string | null>(null);

  const remove = async (studio: Studio) => {
    const ok = await confirm({
      tone: "error",
      title: "Delete this studio?",
      confirmText: "Delete studio",
      cancelText: "Keep it",
      message: (
        <>
          <strong>{studio.title}</strong> will be removed from search right away. This can&apos;t be undone.
        </>
      ),
    });
    if (!ok) return;
    setDeleting(studio._id);
    try {
      await api(`/api/studios/${studio._id}`, { method: "DELETE", auth: true });
      setData((list) => list?.filter((s) => s._id !== studio._id) ?? null);
      toast.success("Studio deleted.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My studios</h1>
          <p className="mt-1 text-base-content/70">Spaces you host on StudioSpace.</p>
        </div>
        <Link href="/dashboard/listings/new" className="btn btn-primary">
          <Plus className="size-4" /> Add a studio
        </Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner label="Loading your studios" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !data?.length ? (
          <EmptyState
            icon={Warehouse}
            title="You haven't listed a studio yet"
            message="Share your space with photographers, filmmakers, podcasters and musicians nearby."
            action={
              <Link href="/dashboard/listings/new" className="btn btn-primary btn-sm">
                List your first studio
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {data.map((s) => (
              <article key={s._id} className="flex flex-col gap-4 rounded-box border border-base-300 p-4 sm:flex-row">
                <StudioImage src={s.images[0]} alt={s.title} className="h-40 w-full shrink-0 rounded-xl sm:h-28 sm:w-40" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{s.title}</h2>
                    <span className="badge badge-sm badge-outline">{s.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-base-content/60">
                    {s.city} · {formatMoney(s.hourlyRate)}/hr · {formatHour(s.openHour)} – {formatHour(s.closeHour)}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm">
                    <Star className="size-4 fill-warning text-warning" />
                    {s.reviewCount > 0 ? `${s.rating.toFixed(1)} · ${s.reviewCount} reviews` : "No reviews yet"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/studios/${s._id}`} className="btn btn-ghost btn-sm">
                      <Eye className="size-4" /> View
                    </Link>
                    <Link href={`/dashboard/listings/${s._id}/edit`} className="btn btn-outline btn-sm">
                      <Pencil className="size-4" /> Edit
                    </Link>
                    <button
                      className="btn btn-outline btn-error btn-sm"
                      onClick={() => remove(s)}
                      disabled={deleting === s._id}
                    >
                      {deleting === s._id ? <span className="loading loading-spinner loading-xs" /> : <Trash2 className="size-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
