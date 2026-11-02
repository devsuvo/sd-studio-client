"use client";

import { CalendarCheck, Inbox, LayoutDashboard, PlusCircle, Warehouse } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth-guard";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My bookings", icon: CalendarCheck },
  { href: "/dashboard/listings", label: "My studios", icon: Warehouse },
  { href: "/dashboard/listings/new", label: "Add a studio", icon: PlusCircle },
  { href: "/dashboard/reservations", label: "Reservations", icon: Inbox },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Longest matching prefix wins, so "/dashboard/listings/new" doesn't also light up "My studios".
  const active = NAV.filter((n) => pathname === n.href || pathname.startsWith(`${n.href}/`)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0]?.href;

  return (
    <AuthGuard>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <nav className="lg:sticky lg:top-24">
            <ul className="menu menu-horizontal w-full gap-1 overflow-x-auto rounded-box border border-base-300 p-2 lg:menu-vertical lg:flex-nowrap">
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
