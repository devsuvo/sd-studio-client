import { Aperture, type LucideIcon } from "lucide-react";
import type { BookingStatus } from "@/lib/types";

/** Branded loader: a spinning aperture used for route transitions and data fetches. */
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4 text-base-content/60">
        <span className="relative grid size-16 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
          <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg">
            <Aperture className="size-7 animate-spin [animation-duration:1.6s]" />
          </span>
        </span>
        <span className="text-sm font-medium">{label}…</span>
      </div>
    </div>
  );
}

/** Consistent page heading used on every inner page. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 leading-relaxed text-base-content/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 bg-base-200/40 px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-primary/10">
        <Icon className="size-7 text-primary" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-base-content/70">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="alert alert-error alert-soft">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  completed: "badge-success",
  declined: "badge-error",
  cancelled: "badge-neutral",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge badge-soft capitalize ${STATUS_STYLE[status]}`}>{status}</span>;
}
