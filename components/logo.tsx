import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-display text-xl font-bold ${className}`}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <rect x="3" y="6" width="13" height="12" rx="2.5" />
          <path d="m16 10 5-3v10l-5-3" strokeLinejoin="round" />
        </svg>
      </span>
      <span>
        SD<span className="text-primary"> Studio</span>
      </span>
    </Link>
  );
}
