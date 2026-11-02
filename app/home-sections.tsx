"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StudioCard, { StudioCardSkeleton } from "@/components/studio-card";
import { ErrorState } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { CATEGORIES } from "@/lib/constants";
import type { Stats, Studio } from "@/lib/types";

export function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    router.push(`/studios${params.size ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="mt-8 flex flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-lg sm:flex-row"
    >
      <label className="input input-ghost grow border-0 focus-within:outline-none">
        <Search className="size-4 opacity-60" />
        <input
          className="grow"
          placeholder="Try “cyc wall”, “Dhaka” or “podcast”"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <select
        className="select select-ghost sm:w-48"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.name}>{c.name}</option>
        ))}
      </select>
      <button className="btn btn-primary">Search</button>
    </form>
  );
}

export function StatsStrip() {
  const { data } = useFetch<Stats>("/api/stats");
  const items = [
    { label: "Studios listed", value: data?.studios },
    { label: "Cities", value: data?.cities },
    { label: "Active hosts", value: data?.hosts },
    { label: "Active bookings", value: data?.bookings },
  ];
  return (
    <section className="border-y border-base-300 bg-base-100">
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
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map(({ name, icon: Icon, blurb }) => {
        const count = data?.categories[name] ?? 0;
        return (
          <Link
            key={name}
            href={`/studios?category=${encodeURIComponent(name)}`}
            className="group flex items-center gap-4 rounded-box border border-base-300 p-5 transition hover:border-primary hover:bg-primary/5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
              <Icon className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{name}</p>
              <p className="truncate text-sm text-base-content/65">{blurb}</p>
              {data && (
                <p className="mt-1 text-xs text-base-content/50">
                  {count} space{count === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function FeaturedStudios() {
  const { data, error, loading, reload } = useFetch<Studio[]>("/api/studios/featured");

  if (error) {
    return (
      <div className="mt-8">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading || !data
        ? Array.from({ length: 6 }, (_, i) => <StudioCardSkeleton key={i} />)
        : data.map((s) => <StudioCard key={s._id} studio={s} />)}
      {!loading && data?.length === 0 && (
        <p className="col-span-full text-base-content/70">
          No studios yet.{" "}
          <Link href="/dashboard/listings/new" className="link link-primary">
            Be the first to list one.
          </Link>
        </p>
      )}
    </div>
  );
}
