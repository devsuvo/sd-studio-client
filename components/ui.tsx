import type { LucideIcon } from "lucide-react";
import type { BookingStatus } from "@/lib/types";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status">
      <div className="flex flex-col items-center gap-3 text-base-content/60">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm">{label}…</span>
      </div>
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
    <div className="flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-base-200">
        <Icon className="size-6 text-base-content/60" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-base-content/70">{message}</p>
      {action}
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
  confirmed: "badge-success",
  declined: "badge-error",
  cancelled: "badge-ghost",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge badge-soft capitalize ${STATUS_STYLE[status]}`}>{status}</span>;
}
