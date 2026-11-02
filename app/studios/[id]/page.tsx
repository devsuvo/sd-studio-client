"use client";

import { ArrowLeft, Check, Clock, Mail, MapPin, Maximize, ScrollText, Star, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import StudioImage from "@/components/studio-image";
import { ErrorState, Spinner } from "@/components/ui";
import UserAvatar from "@/components/user-avatar";
import { useFetch } from "@/hooks/use-fetch";
import { formatHour, formatMoney } from "@/lib/format";
import type { Studio } from "@/lib/types";
import BookingPanel from "./booking-panel";

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: studio, error, loading, reload } = useFetch<Studio>(`/api/studios/${id}`);
  const [active, setActive] = useState(0);

  if (loading) return <Spinner label="Loading studio" />;
  if (error || !studio) {
    return (
      <div className="container-page space-y-4 py-16">
        <ErrorState message={error ?? "This studio couldn't be loaded."} onRetry={reload} />
        <Link href="/studios" className="btn btn-ghost">
          <ArrowLeft className="size-4" /> Back to all studios
        </Link>
      </div>
    );
  }

  const specs = [
    { icon: Maximize, label: "Size", value: `${studio.sizeSqft.toLocaleString()} sq ft` },
    { icon: Users, label: "Capacity", value: `Up to ${studio.capacity} people` },
    { icon: Clock, label: "Open", value: `${formatHour(studio.openHour)} – ${formatHour(studio.closeHour)}` },
    { icon: Clock, label: "Minimum", value: `${studio.minHours} hour${studio.minHours > 1 ? "s" : ""}` },
  ];

  return (
    <div className="container-page py-8">
      <Link href="/studios" className="btn btn-ghost btn-sm -ml-3 mb-4">
        <ArrowLeft className="size-4" /> All studios
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="badge badge-primary badge-soft">{studio.category}</span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{studio.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base-content/70">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {studio.address}, {studio.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              {studio.reviewCount > 0 ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)` : "New listing"}
            </span>
          </p>
        </div>
        <p className="text-right">
          <span className="text-3xl font-bold">{formatMoney(studio.hourlyRate)}</span>
          <span className="text-base-content/60"> / hour</span>
        </p>
      </div>

      {/* Gallery */}
      <div className="mt-6 space-y-3">
        <div className="aspect-[16/8] overflow-hidden rounded-3xl bg-base-200">
          <StudioImage src={studio.images[active]} alt={studio.title} className="size-full" />
        </div>
        {studio.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {studio.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActive(i)}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl ring-offset-2 ring-offset-base-100 transition ${
                  i === active ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Show photo ${i + 1}`}
              >
                <StudioImage src={src} alt="" className="size-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0 space-y-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map((s) => (
              <div key={s.label} className="rounded-box border border-base-300 p-4">
                <s.icon className="size-5 text-primary" />
                <p className="mt-2 text-xs text-base-content/60">{s.label}</p>
                <p className="text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <section>
            <h2 className="text-xl font-semibold">About this space</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/80">{studio.description}</p>
          </section>

          {studio.amenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Amenities</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-base-content/80">
                    <Check className="size-4 text-success" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {studio.equipment.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Equipment included</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {studio.equipment.map((e) => (
                  <span key={e} className="badge badge-lg badge-outline gap-1">
                    <Wrench className="size-3" /> {e}
                  </span>
                ))}
              </div>
            </section>
          )}

          {studio.rules && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ScrollText className="size-5" /> House rules
              </h2>
              <p className="mt-3 whitespace-pre-line text-base-content/80">{studio.rules}</p>
            </section>
          )}

          <section className="flex items-center gap-4 rounded-box border border-base-300 p-5">
            <UserAvatar name={studio.hostName} size="size-14" />
            <div className="min-w-0">
              <p className="text-sm text-base-content/60">Hosted by</p>
              <p className="font-semibold">{studio.hostName}</p>
              <a href={`mailto:${studio.hostEmail}`} className="link link-hover flex items-center gap-1 text-sm">
                <Mail className="size-3.5" /> {studio.hostEmail}
              </a>
            </div>
          </section>
        </div>

        <div>
          <BookingPanel studio={studio} />
        </div>
      </div>
    </div>
  );
}
