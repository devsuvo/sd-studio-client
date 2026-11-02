"use client";

import { Eye, Pencil, Plus, Star, Trash2, Warehouse } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/confirm-dialog";
import StudioImage from "@/components/studio-image";
import { EmptyState, ErrorState, PageHeader, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
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
          <strong>{studio.title}</strong> will be permanently removed from StudioSpace. This can&apos;t be undone.
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

  const actions = (s: Studio) => (
    <div className="flex flex-wrap gap-2">
      <Link href={`/studios/${s._id}`} className="btn btn-ghost btn-sm" aria-label={`View ${s.title}`}>
        <Eye className="size-4" />
      </Link>
      <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-sm">
        <Pencil className="size-4" /> Update
      </Link>
      <button className="btn btn-outline btn-error btn-sm" onClick={() => remove(s)} disabled={deleting === s._id}>
        {deleting === s._id ? <span className="loading loading-spinner loading-xs" /> : <Trash2 className="size-4" />}
        Delete
      </button>
    </div>
  );

  const rating = (s: Studio) => (
    <span className="inline-flex items-center gap-1">
      <Star className="size-4 fill-warning text-warning" />
      {s.reviewCount > 0 ? `${s.rating.toFixed(1)} (${s.reviewCount})` : "New"}
    </span>
  );

  return (
    <div>
      <PageHeader
        title="My Studio Listings"
        subtitle="Spaces you host on StudioSpace."
        action={
          <Link href="/add-studio" className="btn btn-primary">
            <Plus className="size-4" /> Add New Studio
          </Link>
        }
      />

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
            <Link href="/add-studio" className="btn btn-primary btn-sm">
              List your first studio
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-box border border-base-300 md:block">
            <table className="table">
              <thead>
                <tr>
                  <th>Studio</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Rating</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <StudioImage src={s.images[0]} alt={s.title} className="h-14 w-20 shrink-0 rounded-lg" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-semibold">{s.title}</p>
                          <p className="text-xs text-base-content/60">{s.city}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-sm whitespace-nowrap">{s.category}</span>
                    </td>
                    <td className="whitespace-nowrap">{formatMoney(s.hourlyRate)} / hr</td>
                    <td className="whitespace-nowrap">{rating(s)}</td>
                    <td>
                      <div className="flex justify-end">{actions(s)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="grid gap-4 md:hidden">
            {data.map((s) => (
              <article key={s._id} className="rounded-box border border-base-300 p-4">
                <StudioImage src={s.images[0]} alt={s.title} className="aspect-[16/9] w-full rounded-xl" />
                <h2 className="mt-3 font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-base-content/60">
                  {s.category} · {s.city} · {formatMoney(s.hourlyRate)} / hr
                </p>
                <p className="mt-1 text-sm">{rating(s)}</p>
                <div className="mt-3">{actions(s)}</div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
