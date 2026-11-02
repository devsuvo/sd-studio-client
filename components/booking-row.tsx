import { CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDate, formatHour, formatMoney } from "@/lib/format";
import type { Booking } from "@/lib/types";
import StudioImage from "./studio-image";
import { StatusBadge } from "./ui";

/** Shared card for guest bookings and host reservations; `actions` and `extra` vary by view. */
export default function BookingRow({
  booking,
  actions,
  extra,
}: {
  booking: Booking;
  actions?: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-box border border-base-300 p-4 sm:flex-row">
      <Link href={`/studios/${booking.studioId}`} className="shrink-0">
        <StudioImage
          src={booking.studio.image}
          alt={booking.studio.title}
          className="h-40 w-full rounded-xl sm:h-28 sm:w-40"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/studios/${booking.studioId}`} className="link-hover font-semibold">
              {booking.studio.title}
            </Link>
            <p className="flex items-center gap-1 text-sm text-base-content/60">
              <MapPin className="size-3.5" /> {booking.studio.city} · {booking.studio.category}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4 text-base-content/60" /> {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4 text-base-content/60" /> {formatHour(booking.startHour)} –{" "}
            {formatHour(booking.endHour)} ({booking.hours}h)
          </span>
          <span className="font-semibold">{formatMoney(booking.pricing.total)}</span>
        </div>
        {extra}
        {booking.note && (
          <p className="mt-2 line-clamp-2 text-sm italic text-base-content/70">&ldquo;{booking.note}&rdquo;</p>
        )}
        {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </article>
  );
}
