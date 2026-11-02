import { StudioCardSkeleton } from "@/components/studio-card";

export default function Loading() {
  return (
    <div className="container-page py-10" role="status" aria-label="Loading studios">
      <div className="skeleton h-10 w-64" />
      <div className="skeleton mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <StudioCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
