"use client";

import { ChevronLeft, ChevronRight, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import StudioCard, { StudioCardSkeleton } from "@/components/studio-card";
import { EmptyState, ErrorState } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import type { StudioPage } from "@/lib/types";

const FILTER_KEYS = ["search", "category", "city", "minPrice", "maxPrice", "capacity"] as const;

export default function StudioBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(params.get("search") ?? "");

  const urlSearch = params.get("search") ?? "";
  const lastPushed = useRef(urlSearch);

  // Keep the box in sync when the URL changes from elsewhere (back button, clear filters),
  // without overwriting what the user is still typing.
  useEffect(() => {
    if (urlSearch !== lastPushed.current) {
      lastPushed.current = urlSearch;
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const query = new URLSearchParams(params);
  if (!query.get("limit")) query.set("limit", "9");
  const { data, error, loading, reload } = useFetch<StudioPage>(`/api/studios?${query}`);
  const { data: cities } = useFetch<string[]>("/api/studios/cities");

  const update = (changes: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (resetPage) next.delete("page");
    router.push(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  // Debounce typing in the search box.
  useEffect(() => {
    const value = search.trim();
    if (value === urlSearch) return;
    const t = setTimeout(() => {
      lastPushed.current = value;
      update({ search: value || null });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const activeCount = FILTER_KEYS.filter((k) => params.get(k)).length;
  const page = Number(params.get("page") ?? 1);

  const filters = (
    <div className="space-y-5">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Category</legend>
        <select
          className="select w-full"
          value={params.get("category") ?? ""}
          onChange={(e) => update({ category: e.target.value || null })}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">City</legend>
        <select
          className="select w-full"
          value={params.get("city") ?? ""}
          onChange={(e) => update({ city: e.target.value || null })}
        >
          <option value="">Any city</option>
          {cities?.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Hourly rate (USD)</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            className="input w-full"
            placeholder="Min"
            defaultValue={params.get("minPrice") ?? ""}
            key={`min-${params.get("minPrice")}`}
            onBlur={(e) => update({ minPrice: e.target.value || null })}
          />
          <span className="text-base-content/50">–</span>
          <input
            type="number"
            min={0}
            className="input w-full"
            placeholder="Max"
            defaultValue={params.get("maxPrice") ?? ""}
            key={`max-${params.get("maxPrice")}`}
            onBlur={(e) => update({ maxPrice: e.target.value || null })}
          />
        </div>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Group size</legend>
        <select
          className="select w-full"
          value={params.get("capacity") ?? ""}
          onChange={(e) => update({ capacity: e.target.value || null })}
        >
          <option value="">Any size</option>
          {[2, 5, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n}+ people
            </option>
          ))}
        </select>
      </fieldset>
      {activeCount > 0 && (
        <button
          className="btn btn-ghost btn-sm w-full"
          onClick={() => {
            setSearch("");
            router.push(pathname, { scroll: false });
          }}
        >
          <X className="size-4" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-box border border-base-300 p-5">{filters}</div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="input w-full sm:flex-1">
            <Search className="size-4 opacity-60" />
            <input
              className="grow"
              placeholder="Search by name, city, gear or amenity"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button className="btn lg:hidden" onClick={() => setShowFilters((s) => !s)}>
              <SlidersHorizontal className="size-4" /> Filters
              {activeCount > 0 && <span className="badge badge-primary badge-sm">{activeCount}</span>}
            </button>
            <select
              className="select w-48"
              aria-label="Sort by"
              value={params.get("sort") ?? "newest"}
              onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && <div className="mt-4 rounded-box border border-base-300 p-5 lg:hidden">{filters}</div>}

        <p className="mt-5 text-sm text-base-content/70">
          {loading ? "Searching…" : data ? `${data.total} studio${data.total === 1 ? "" : "s"} found` : ""}
        </p>

        {error ? (
          <div className="mt-4">
            <ErrorState message={error} onRetry={reload} />
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading || !data
              ? Array.from({ length: 6 }, (_, i) => <StudioCardSkeleton key={i} />)
              : data.items.map((s) => <StudioCard key={s._id} studio={s} />)}
          </div>
        )}

        {!loading && data?.items.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No studios match those filters"
            message="Try a wider price range, another city, or clear the filters to see everything."
          />
        )}

        {data && data.pages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="join">
              <button
                className="join-item btn"
                disabled={page <= 1}
                onClick={() => update({ page: String(page - 1) }, false)}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`join-item btn ${p === page ? "btn-primary" : ""}`}
                  onClick={() => update({ page: p === 1 ? null : String(p) }, false)}
                >
                  {p}
                </button>
              ))}
              <button
                className="join-item btn"
                disabled={page >= data.pages}
                onClick={() => update({ page: String(page + 1) }, false)}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
