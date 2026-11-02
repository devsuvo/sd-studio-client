import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { Studio } from "@/lib/types";
import StudioImage from "./studio-image";

export default function StudioCard({ studio }: { studio: Studio }) {
  const href = `/studios/${studio._id}`;
  return (
    <article className="group card overflow-hidden border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1}>
        <StudioImage
          src={studio.images[0]}
          alt={studio.title}
          className="size-full transition duration-500 group-hover:scale-105"
        />
        <span className="badge badge-neutral absolute left-3 top-3 border-0 bg-neutral/80 backdrop-blur">
          {studio.category}
        </span>
        <span className="badge absolute right-3 top-3 gap-1 border-0 bg-base-100/95 font-semibold shadow">
          <Star className="size-3.5 fill-warning text-warning" />
          {studio.reviewCount > 0 ? studio.rating.toFixed(1) : "New"}
        </span>
      </Link>
      <div className="card-body gap-2 p-5">
        <h3 className="card-title line-clamp-1 text-base">
          <Link href={href} className="link-hover">
            {studio.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 text-sm text-base-content/70">
          <MapPin className="size-4 shrink-0" /> <span className="truncate">{studio.city}</span>
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p>
            <span className="text-lg font-bold">${studio.hourlyRate}</span>
            <span className="text-sm text-base-content/60"> / hr</span>
          </p>
          <Link href={href} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="card overflow-hidden border border-base-300">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-8 w-full" />
      </div>
    </div>
  );
}
