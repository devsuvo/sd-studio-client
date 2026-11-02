"use client";

import { Check, Inbox, Mail, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BookingRow from "@/components/booking-row";
import { useConfirm } from "@/components/confirm-dialog";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatHour, formatMoney } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

const FILTERS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "all", label: "All" },
];

const ACTION_COPY: Record<"confirmed" | "declined" | "cancelled", { title: string; button: string; done: string }> = {
  confirmed: { title: "Confirm this booking?", button: "Confirm booking", done: "Booking confirmed. The guest can see it now." },
  declined: { title: "Decline this request?", button: "Decline", done: "Request declined. The time is open again." },
  cancelled: { title: "Cancel a confirmed booking?", button: "Cancel booking", done: "Booking cancelled." },
};

export default function ReservationsPage() {
  const confirm = useConfirm();
  const { data, setData, error, loading, reload } = useFetch<Booking[]>("/api/bookings/host", { auth: true });
  const [filter, setFilter] = useState<BookingStatus | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = (data ?? []).filter((b) => filter === "all" || b.status === filter);
  const pendingCount = data?.filter((b) => b.status === "pending").length ?? 0;

  const changeStatus = async (b: Booking, status: "confirmed" | "declined" | "cancelled") => {
    const copy = ACTION_COPY[status];
    const ok = await confirm({
      title: copy.title,
      confirmText: copy.button,
      tone: status === "confirmed" ? "primary" : "error",
      message: (
        <>
          <strong>{b.guestName}</strong> · {b.studio.title}
          <br />
          {formatDate(b.date)}, {formatHour(b.startHour)} – {formatHour(b.endHour)} · {formatMoney(b.pricing.total)}
        </>
      ),
    });
    if (!ok) return;
    setBusyId(b._id);
    try {
      const updated = await api<Booking>(`/api/bookings/${b._id}/status`, { method: "PATCH", auth: true, body: { status } });
      setData((all) => all?.map((x) => (x._id === updated._id ? updated : x)) ?? null);
      toast.success(copy.done);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold sm:text-4xl">Reservations</h1>
      <p className="mt-1 text-base-content/70">Requests from creators who want to use your studios.</p>

      <div role="tablist" className="tabs tabs-box mt-6 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            className={`tab ${filter === f.value ? "tab-active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value === "pending" && pendingCount > 0 && <span className="badge badge-warning badge-sm ml-2">{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Spinner label="Loading reservations" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filter === "pending" ? "You're all caught up" : "No reservations here"}
            message="New requests for your studios will appear here for you to confirm or decline."
          />
        ) : (
          list.map((b) => {
            const busy = busyId === b._id;
            return (
              <BookingRow
                key={b._id}
                booking={b}
                extra={
                  <p className="mt-2 flex items-center gap-1 text-sm text-base-content/70">
                    Guest: <span className="font-medium text-base-content">{b.guestName}</span>
                    <a href={`mailto:${b.guestEmail}`} className="link link-hover ml-1 inline-flex items-center gap-1">
                      <Mail className="size-3.5" /> {b.guestEmail}
                    </a>
                  </p>
                }
                actions={
                  b.status === "pending" ? (
                    <>
                      <button className="btn btn-success btn-sm" disabled={busy} onClick={() => changeStatus(b, "confirmed")}>
                        <Check className="size-4" /> Confirm
                      </button>
                      <button className="btn btn-outline btn-error btn-sm" disabled={busy} onClick={() => changeStatus(b, "declined")}>
                        <X className="size-4" /> Decline
                      </button>
                    </>
                  ) : b.status === "confirmed" ? (
                    <button className="btn btn-ghost btn-sm text-error" disabled={busy} onClick={() => changeStatus(b, "cancelled")}>
                      Cancel booking
                    </button>
                  ) : null
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
