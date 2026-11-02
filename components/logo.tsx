import { Aperture } from "lucide-react";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-display text-xl font-bold ${className}`} aria-label="StudioSpace home">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content shadow-sm">
        <Aperture className="size-5" strokeWidth={2.2} />
      </span>
      <span>
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
