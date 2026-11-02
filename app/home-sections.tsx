"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StudioCard, { StudioCardSkeleton } from "@/components/studio-card";
import Reveal from "@/components/reveal";
import { ErrorState } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { HOME_CATEGORIES } from "@/lib/constants";
import type { Stats, Studio } from "@/lib/types";

export function StatsStrip() {
  const { data } = useFetch<Stats>("/api/stats");
  const items = [
    { label: "Studios listed", value: data?.studios },
    { label: "Cities", value: data?.cities },
    { label: "Active hosts", value: data?.hosts },
    { label: "Active bookings", value: data?.bookings },
  ];
  return (
    <section className="border-b border-base-300 bg-base-100">
      <div className="container-page grid grid-cols-2 divide-base-300 py-8 md:grid-cols-4 md:divide-x">
        {items.map((s) => (
          <div key={s.label} className="py-2 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {s.value ?? <span className="skeleton inline-block h-8 w-12 align-middle" />}
            </p>
            <p className="mt-1 text-sm text-base-content/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryGrid() {
  const { data } = useFetch<Stats>("/api/stats");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {HOME_CATEGORIES.map(({ label, category, icon: Icon, blurb }, i) => {
        const count = data?.categories[category] ?? 0;
        return (
          <Reveal key={label} delay={i * 70} className="h-full">
          <Link
            href={`/studios?category=${encodeURIComponent(category)}`}
            className="group flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
              <Icon className="size-6" />
            </span>
            <p className="mt-4 font-semibold">{label}</p>
            <p className="mt-1 flex-1 text-sm text-base-content/65">{blurb}</p>
            <p className="mt-3 flex items-center justify-between text-xs text-base-content/55">
              {data ? `${count} space${count === 1 ? "" : "s"}` : <span className="skeleton h-3 w-12" />}
              <ArrowRight className="size-4 transition group-hover:translate-x-1 group-hover:text-primary" />
            </p>
          </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

export function FeaturedStudios() {
  const { data, error, loading, reload } = useFetch<Studio[]>("/api/studios/featured");

  if (error) {
    return (
      <div>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading || !data
        ? Array.from({ length: 6 }, (_, i) => <StudioCardSkeleton key={i} />)
        : data.map((s, i) => (
            <Reveal key={s._id} delay={(i % 3) * 90} className="h-full">
              <StudioCard studio={s} />
            </Reveal>
          ))}
      {!loading && data?.length === 0 && (
        <p className="col-span-full text-base-content/70">
          No studios yet.{" "}
          <Link href="/add-studio" className="link link-primary">
            Be the first to list one.
          </Link>
        </p>
      )}
    </div>
  );
}
