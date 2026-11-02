"use client";

import { CalendarDays, Info, Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/confirm-dialog";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate, formatHour, formatMoney, quote, todayString } from "@/lib/format";
import type { Availability, Booking, Studio } from "@/lib/types";

export default function BookingPanel({ studio }: { studio: Studio }) {
  const router = useRouter();
  const pathname = usePathname();
  const confirm = useConfirm();
  const { data: session } = useSession();
  const [date, setDate] = useState(todayString());
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: availability, loading, error, reload } = useFetch<Availability>(
    date ? `/api/studios/${studio._id}/availability?date=${date}` : null,
  );

  useEffect(() => {
    setStart(null);
    setEnd(null);
  }, [date]);

  const isOwner = session?.user.id === studio.hostId;
  const { openHour, closeHour, minHours } = studio;
  const hours = useMemo(() => Array.from({ length: closeHour - openHour }, (_, i) => openHour + i), [openHour, closeHour]);

  // Hours that can't be booked: held by someone else, or already passed today.
  const blocked = useMemo(() => {
    const set = new Set<number>();
    availability?.booked.forEach((b) => {
      for (let h = b.startHour; h < b.endHour; h++) set.add(h);
    });
    if (date === todayString()) {
      const now = new Date().getHours();
      hours.forEach((h) => h <= now && set.add(h));
    }
    return set;
  }, [availability, date, hours]);

  const rangeFree = (s: number, e: number) => {
    for (let h = s; h < e; h++) if (blocked.has(h)) return false;
    return e <= closeHour;
  };

  const startOptions = hours.filter((h) => rangeFree(h, h + minHours));
  const endOptions =
    start === null
      ? []
      : Array.from({ length: closeHour - start }, (_, i) => start + i + 1).filter(
          (e) => e - start >= minHours && rangeFree(start, e),
        );

  const pickHour = (h: number) => {
    if (blocked.has(h)) return;
    // Second click after the start extends the range; anything else starts over.
    if (start !== null && h >= start && rangeFree(start, h + 1) && h + 1 - start >= minHours) {
      setEnd(h + 1);
      return;
    }
    if (rangeFree(h, h + minHours)) {
      setStart(h);
      setEnd(h + minHours);
    } else {
      toast.warning(`This studio needs ${minHours} free hour${minHours > 1 ? "s" : ""} in a row from your start time.`);
    }
  };

  const selectedHours = start !== null && end !== null ? end - start : 0;
  const price = quote(studio.hourlyRate, studio.cleaningFee, selectedHours);

  const submit = async () => {
    if (!session) {
      toast.info("Log in to request this studio.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (start === null || end === null) {
      toast.error("Choose a start and end time first.");
      return;
    }
    const ok = await confirm({
      title: "Send booking request?",
      confirmText: `Request for ${formatMoney(price.total)}`,
      message: (
        <div className="space-y-1">
          <p className="font-medium text-base-content">{studio.title}</p>
          <p>
            {formatDate(date)} · {formatHour(start)} – {formatHour(end)} ({selectedHours}h)
          </p>
          <p>The host will confirm or decline. You can cancel from your dashboard at any time before the session.</p>
        </div>
      ),
    });
    if (!ok) return;

    setSubmitting(true);
    try {
      await api<Booking>("/api/bookings", {
        method: "POST",
        auth: true,
        body: { studioId: studio._id, date, startHour: start, endHour: end, note },
      });
      toast.success("Request sent! The host will review it shortly.", {
        action: { label: "View bookings", onClick: () => router.push("/dashboard/bookings") },
      });
      setStart(null);
      setEnd(null);
      setNote("");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
      reload();
    }
  };

  if (isOwner) {
    return (
      <aside className="sticky top-24 rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">This is your studio</h2>
        <p className="mt-2 text-sm text-base-content/70">
          Guests see a booking panel here. You can update details or review incoming requests.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href={`/dashboard/listings/${studio._id}/edit`} className="btn btn-primary">
            <Pencil className="size-4" /> Edit listing
          </Link>
          <Link href="/dashboard/reservations" className="btn btn-outline">
            View reservations
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-24 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Check availability</h2>

      <fieldset className="fieldset mt-3">
        <legend className="fieldset-legend">Date</legend>
        <label className="input w-full">
          <CalendarDays className="size-4 opacity-60" />
          <input
            type="date"
            className="grow"
            min={todayString()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </fieldset>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-base-content/60">
          <span>Tap a start hour, then an end hour</span>
          {loading && <span className="loading loading-dots loading-xs" />}
        </div>
        {error ? (
          <p className="text-sm text-error">{error}</p>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {hours.map((h) => {
              const isBlocked = blocked.has(h);
              const selected = start !== null && end !== null && h >= start && h < end;
              return (
                <button
                  key={h}
                  type="button"
                  disabled={isBlocked || loading}
                  onClick={() => pickHour(h)}
                  title={isBlocked ? "Unavailable" : formatHour(h)}
                  className={`rounded-lg border px-1 py-2 text-xs font-medium transition ${
                    selected
                      ? "border-primary bg-primary text-primary-content"
                      : isBlocked
                        ? "cursor-not-allowed border-base-300 bg-base-200 text-base-content/35 line-through"
                        : "border-base-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  {formatHour(h).replace(":00", "")}
                </button>
              );
            })}
          </div>
        )}
        <div className="mt-2 flex gap-4 text-xs text-base-content/60">
          <span className="flex items-center gap-1">
            <span className="size-3 rounded border border-base-300" /> Open
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded bg-base-300" /> Booked / past
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 rounded bg-primary" /> Your pick
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Start</legend>
          <select
            className="select select-sm w-full"
            value={start ?? ""}
            onChange={(e) => {
              const s = e.target.value === "" ? null : Number(e.target.value);
              setStart(s);
              setEnd(s === null ? null : s + minHours);
            }}
          >
            <option value="">Select</option>
            {startOptions.map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">End</legend>
          <select
            className="select select-sm w-full"
            value={end ?? ""}
            disabled={start === null}
            onChange={(e) => setEnd(Number(e.target.value))}
          >
            {endOptions.map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      {availability && startOptions.length === 0 && !loading && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm text-warning">
          <Info className="mt-0.5 size-4 shrink-0" /> No open slots left on this date. Try another day.
        </p>
      )}

      <fieldset className="fieldset mt-2">
        <legend className="fieldset-legend">
          Note for the host <span className="font-normal text-base-content/60">(optional)</span>
        </legend>
        <textarea
          className="textarea w-full"
          rows={2}
          maxLength={500}
          placeholder="Crew size, what you're shooting, gear you'll bring…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </fieldset>

      <div className="mt-4 space-y-2 border-t border-base-300 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-base-content/70">
            {formatMoney(studio.hourlyRate)} × {selectedHours} hour{selectedHours === 1 ? "" : "s"}
          </span>
          <span>{formatMoney(price.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/70">Cleaning fee</span>
          <span>{formatMoney(selectedHours ? studio.cleaningFee : 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/70">Service fee (5%)</span>
          <span>{formatMoney(price.serviceFee)}</span>
        </div>
        <div className="flex justify-between border-t border-base-300 pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{formatMoney(selectedHours ? price.total : 0)}</span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary mt-5 w-full"
        disabled={submitting || (session ? selectedHours === 0 : false)}
        onClick={submit}
      >
        {submitting && <span className="loading loading-spinner loading-sm" />}
        {session ? "Request booking" : "Log in to book"}
      </button>
      <p className="mt-2 text-center text-xs text-base-content/60">Sending a request is free. Your slot is held while the host reviews it.</p>
    </aside>
  );
}
