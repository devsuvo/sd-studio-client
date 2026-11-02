import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-base-300 bg-base-200">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-base-content/70">
            A peer-to-peer marketplace where creators book studios by the hour from the people who built them.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Spaces</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <Link className="link-hover" href={`/studios?category=${encodeURIComponent(c.name)}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Hosting</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>
              <Link className="link-hover" href="/dashboard/listings/new">
                List your studio
              </Link>
            </li>
            <li>
              <Link className="link-hover" href="/dashboard/reservations">
                Manage reservations
              </Link>
            </li>
            <li>
              <Link className="link-hover" href="/dashboard/listings">
                Your listings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Booking basics</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>Hourly pricing with a 5% service fee</li>
            <li>Hosts confirm requests</li>
            <li>Cancel any active booking from your dashboard</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-300">
        <p className="container-page py-5 text-center text-xs text-base-content/60">
          © {new Date().getFullYear()} SD Studio. Built for creators, by creators.
        </p>
      </div>
    </footer>
  );
}
