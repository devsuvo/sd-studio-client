import { Home, Search } from "lucide-react";
import Link from "next/link";

/** Illustration: an empty studio set — spotlight, tripod camera and a blank backdrop. */
function EmptySetIllustration() {
  return (
    <svg viewBox="0 0 360 240" className="w-full max-w-md" role="img" aria-label="An empty studio with a spotlight and camera">
      {/* backdrop */}
      <path d="M70 30h220v150H70z" className="fill-base-200" />
      <path d="M70 180c40-6 180-6 220 0v20H70z" className="fill-base-300" />
      {/* spotlight beam */}
      <path d="M300 20 180 175h-90L278 14z" className="fill-primary" opacity="0.12" />
      <rect x="274" y="6" width="34" height="22" rx="6" className="fill-neutral" transform="rotate(-25 291 17)" />
      <path d="M300 30v170" className="stroke-neutral" strokeWidth="4" />
      <path d="M300 200l-16 22M300 200l16 22" className="stroke-neutral" strokeWidth="4" strokeLinecap="round" />
      {/* 404 on the backdrop */}
      <text x="135" y="125" className="fill-primary font-display" fontSize="64" fontWeight="700" textAnchor="middle">
        404
      </text>
      {/* camera on tripod */}
      <rect x="32" y="98" width="62" height="40" rx="8" className="fill-secondary" />
      <circle cx="63" cy="118" r="12" className="fill-base-100" />
      <circle cx="63" cy="118" r="6" className="fill-secondary" />
      <rect x="44" y="90" width="18" height="10" rx="3" className="fill-secondary" />
      <path d="M63 138v40M63 178l-20 44M63 178l20 44M63 178v44" className="stroke-neutral" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16 text-center">
      <div className="flex flex-col items-center">
        <EmptySetIllustration />
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">This set is empty</h1>
        <p className="mt-3 max-w-md leading-relaxed text-base-content/70">
          The page you&apos;re looking for has wrapped, moved, or never made it to the call sheet.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home className="size-4" /> Return to Home
          </Link>
          <Link href="/studios" className="btn btn-outline">
            <Search className="size-4" /> Explore Studios
          </Link>
        </div>
      </div>
    </div>
  );
}
