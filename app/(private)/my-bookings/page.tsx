"use client";

import { CalendarX, FileDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import BookingRow from "@/components/booking-row";
import { useConfirm } from "@/components/confirm-dialog";
import { EmptyState, ErrorState, PageHeader, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatHour } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

type Filter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Declined requests are grouped with cancelled ones.
const matches = (f: Filter, s: BookingStatus) =>
  f === "all" || s === f || (f === "cancelled" && s === "declined");

export default function MyBookingsPage() {
  const confirm = useConfirm();
  const { data, setData, error, loading, reload } = useFetch<Booking[]>("/api/bookings/me", { auth: true });
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = (data ?? []).filter((b) => matches(filter, b.status));
  const count = (f: Filter) => (data ?? []).filter((b) => matches(f, b.status)).length;

  const cancel = async (b: Booking) => {
    const ok = await confirm({
      tone: "error",
      title: "Cancel this booking?",
      confirmText: "Yes, cancel it",
      cancelText: "Keep booking",
      message: (
        <>
          <strong>{b.studio.title}</strong> on {formatDate(b.date)}, {formatHour(b.startHour)} – {formatHour(b.endHour)}.
          The time will be released to other creators.
        </>
      ),
    });
    if (!ok) return;
    setBusyId(b._id);
    try {
      const updated = await api<Booking>(`/api/bookings/${b._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status: "cancelled" },
      });
      setData((all) => all?.map((x) => (x._id === updated._id ? updated : x)) ?? null);
      toast.success("Booking cancelled.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const invoice = async (b: Booking) => {
    try {
      const { downloadInvoice } = await import("@/lib/invoice");
      await downloadInvoice(b);
      toast.success("Receipt downloaded.");
    } catch {
      toast.error("We couldn't create the PDF. Please try again.");
    }
  };

  return (
    <div>
      <PageHeader title="My Bookings" subtitle="Studios you've reserved as a creator." />

      <div role="tablist" className="tabs tabs-box w-full flex-nowrap overflow-x-auto sm:w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            className={`tab whitespace-nowrap ${filter === f.value ? "tab-active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {data && <span className="badge badge-sm ml-2">{count(f.value)}</span>}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Spinner label="Loading your bookings" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            message="Find a studio that fits your next shoot and reserve it by the hour. Your reservations will show up here."
            action={
              <Link href="/studios" className="btn btn-primary btn-sm">
                Explore Studios
              </Link>
            }
          />
        ) : (
          list.map((b) => (
            <BookingRow
              key={b._id}
              booking={b}
              actions={
                <>
                  {b.status === "pending" && (
                    <button
                      className="btn btn-outline btn-error btn-sm"
                      disabled={busyId === b._id}
                      onClick={() => cancel(b)}
                    >
                      {busyId === b._id && <span className="loading loading-spinner loading-xs" />}
                      Cancel Booking
                    </button>
                  )}
                  {(b.status === "confirmed" || b.status === "completed") && (
                    <button className="btn btn-outline btn-sm" onClick={() => invoice(b)}>
                      <FileDown className="size-4" /> Download receipt (PDF)
                    </button>
                  )}
                </>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
