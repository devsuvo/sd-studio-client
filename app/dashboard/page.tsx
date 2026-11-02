"use client";

import { CalendarCheck, CalendarClock, DollarSign, Inbox, Search, Warehouse, Wallet } from "lucide-react";
import Link from "next/link";
import { ErrorState } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { useSession } from "@/lib/auth-client";
import { formatMoney } from "@/lib/format";
import type { Summary } from "@/lib/types";

export default function DashboardOverview() {
  const { data: session } = useSession();
  const { data, error, loading, reload } = useFetch<Summary>("/api/bookings/summary", { auth: true });
  const firstName = session?.user.name.split(" ")[0] ?? "there";

  const cards = [
    { label: "Upcoming sessions", value: data?.upcoming, icon: CalendarClock, href: "/dashboard/bookings" },
    { label: "Total bookings", value: data?.bookings, icon: CalendarCheck, href: "/dashboard/bookings" },
    { label: "Confirmed spend", value: data && formatMoney(data.spent), icon: DollarSign, href: "/dashboard/bookings" },
    { label: "Studios listed", value: data?.listings, icon: Warehouse, href: "/dashboard/listings" },
    { label: "Requests to review", value: data?.pendingRequests, icon: Inbox, href: "/dashboard/reservations" },
    { label: "Confirmed earnings", value: data && formatMoney(data.earnings), icon: Wallet, href: "/dashboard/reservations" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Hi, {firstName}</h1>
      <p className="mt-1 text-base-content/70">Here&apos;s what&apos;s happening with your bookings and studios.</p>

      {error && (
        <div className="mt-6">
          <ErrorState message={error} onRetry={reload} />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex items-center gap-4 rounded-box border border-base-300 p-5 transition hover:border-primary"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <c.icon className="size-5" />
            </span>
            <div>
              <p className="text-sm text-base-content/60">{c.label}</p>
              {loading ? (
                <span className="skeleton mt-1 block h-7 w-16" />
              ) : (
                <p className="font-display text-2xl font-bold">{c.value ?? "—"}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {data && data.pendingRequests > 0 && (
        <div role="alert" className="alert alert-warning alert-soft mt-6">
          <Inbox className="size-5" />
          <span>
            You have {data.pendingRequests} booking request{data.pendingRequests > 1 ? "s" : ""} waiting for a response.
          </span>
          <Link href="/dashboard/reservations" className="btn btn-sm">
            Review
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-box bg-primary/10 p-6">
          <h2 className="text-lg font-semibold">Planning a shoot?</h2>
          <p className="mt-1 text-sm text-base-content/70">Browse studios with live hourly availability.</p>
          <Link href="/studios" className="btn btn-primary btn-sm mt-4">
            <Search className="size-4" /> Find a studio
          </Link>
        </div>
        <div className="rounded-box bg-secondary/10 p-6">
          <h2 className="text-lg font-semibold">Have a space to share?</h2>
          <p className="mt-1 text-sm text-base-content/70">List it and start taking requests today.</p>
          <Link href="/dashboard/listings/new" className="btn btn-secondary btn-sm mt-4">
            <Warehouse className="size-4" /> List a studio
          </Link>
        </div>
      </div>
    </div>
  );
}
