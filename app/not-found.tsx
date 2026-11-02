import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <Compass className="mx-auto size-12 text-primary" />
        <p className="mt-4 font-display text-6xl font-bold">404</p>
        <h1 className="mt-2 text-2xl font-semibold">This page isn&apos;t on the call sheet</h1>
        <p className="mt-2 text-base-content/70">The link may be broken, or the studio may have been removed.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/studios" className="btn btn-ghost">
            Browse studios
          </Link>
        </div>
      </div>
    </div>
  );
}
