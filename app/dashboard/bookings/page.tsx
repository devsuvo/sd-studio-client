"use client";

import { CalendarX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import BookingRow from "@/components/booking-row";
import { useConfirm } from "@/components/confirm-dialog";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatHour, todayString } from "@/lib/format";
import type { Booking } from "@/lib/types";

const TABS = ["upcoming", "past", "cancelled"] as const;
type Tab = (typeof TABS)[number];

export default function MyBookingsPage() {
  const confirm = useConfirm();
  const { data, setData, error, loading, reload } = useFetch<Booking[]>("/api/bookings/me", { auth: true });
  const [tab, setTab] = useState<Tab>("upcoming");
  const [busyId, setBusyId] = useState<string | null>(null);

  const today = todayString();
  const groups: Record<Tab, Booking[]> = { upcoming: [], past: [], cancelled: [] };
  data?.forEach((b) => {
    if (b.status === "cancelled" || b.status === "declined") groups.cancelled.push(b);
    else if (b.date >= today) groups.upcoming.push(b);
    else groups.past.push(b);
  });
  groups.upcoming.sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);

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
      setData((list) => list?.map((x) => (x._id === updated._id ? updated : x)) ?? null);
      toast.success("Booking cancelled.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">My bookings</h1>
      <p className="mt-1 text-base-content/70">Studios you&apos;ve requested as a creator.</p>

      <div role="tablist" className="tabs tabs-border mt-6">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            className={`tab capitalize ${tab === t ? "tab-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "cancelled" ? "Cancelled / declined" : t}
            {data && <span className="badge badge-sm ml-2">{groups[t].length}</span>}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Spinner label="Loading your bookings" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : groups[tab].length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={tab === "upcoming" ? "No upcoming sessions" : `No ${tab} bookings`}
            message={
              tab === "upcoming"
                ? "When you request a studio, it shows up here so you can track the host's response."
                : "Nothing here yet."
            }
            action={
              tab === "upcoming" && (
                <Link href="/studios" className="btn btn-primary btn-sm">
                  Find a studio
                </Link>
              )
            }
          />
        ) : (
          groups[tab].map((b) => (
            <BookingRow
              key={b._id}
              booking={b}
              actions={
                tab === "upcoming" && (
                  <button
                    className="btn btn-outline btn-error btn-sm"
                    disabled={busyId === b._id}
                    onClick={() => cancel(b)}
                  >
                    {busyId === b._id && <span className="loading loading-spinner loading-xs" />}
                    Cancel booking
                  </button>
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
