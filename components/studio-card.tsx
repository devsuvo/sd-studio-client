import { MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { Studio } from "@/lib/types";
import StudioImage from "./studio-image";

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/studios/${studio._id}`}
      className="group card overflow-hidden border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <figure className="relative aspect-[4/3] overflow-hidden">
        <StudioImage
          src={studio.images[0]}
          alt={studio.title}
          className="size-full transition duration-500 group-hover:scale-105"
        />
        <span className="badge badge-neutral absolute left-3 top-3 border-0 bg-neutral/80 backdrop-blur">
          {studio.category}
        </span>
      </figure>
      <div className="card-body gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title line-clamp-1 text-base">{studio.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
            <Star className="size-4 fill-warning text-warning" />
            {studio.reviewCount > 0 ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <p className="flex items-center gap-1 text-sm text-base-content/70">
          <MapPin className="size-4" /> {studio.city}
          <span className="mx-1">·</span>
          <Users className="size-4" /> Up to {studio.capacity}
        </p>
        <p className="mt-1 text-sm">
          <span className="text-lg font-bold">{formatMoney(studio.hourlyRate)}</span>
          <span className="text-base-content/60"> / hour</span>
          {studio.minHours > 1 && <span className="text-base-content/60"> · {studio.minHours}h min</span>}
        </p>
      </div>
    </Link>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="card overflow-hidden border border-base-300">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-5 w-1/3" />
      </div>
    </div>
  );
}
