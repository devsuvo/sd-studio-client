"use client";

import { CalendarCheck, Heart, Inbox, LayoutDashboard, PlusCircle, Warehouse } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth-guard";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Warehouse },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/saved", label: "Saved Studios", icon: Heart },
  { href: "/dashboard/reservations", label: "Reservations", icon: Inbox },
];

/** Shared shell for every private route: session guard + sidebar. */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Longest matching prefix wins, so "/dashboard/reservations" doesn't also light up "Overview".
  const active =
    NAV.filter((n) => pathname === n.href || pathname.startsWith(`${n.href}/`)).sort(
      (a, b) => b.href.length - a.href.length,
    )[0]?.href ?? (pathname.startsWith("/studios/edit") ? "/my-listings" : undefined);

  return (
    <AuthGuard>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="lg:sticky lg:top-24">
            <ul className="menu menu-horizontal w-full flex-nowrap gap-1 overflow-x-auto rounded-box border border-base-300 p-2 lg:menu-vertical">
              {NAV.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className={`whitespace-nowrap ${active === href ? "menu-active" : ""}`}>
                    <Icon className="size-4" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </AuthGuard>
  );
}
