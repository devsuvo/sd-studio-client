"use client";

import { CalendarCheck, LayoutDashboard, LogOut, Menu, Plus, Warehouse } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { useConfirm } from "./confirm-dialog";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";
import UserAvatar from "./user-avatar";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/dashboard/listings/new", label: "Become a Host" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Log out?",
      message: "You'll need to sign in again to manage your bookings and studios.",
      confirmText: "Log out",
    });
    if (!ok) return;
    await signOut();
    toast.success("You've been logged out. See you soon!");
    router.push("/");
    router.refresh();
  };

  const linkItems = LINKS.map((l) => (
    <li key={l.href}>
      <Link href={l.href} className={isActive(l.href) ? "font-semibold text-primary" : ""}>
        {l.label}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/85 backdrop-blur">
      <nav className="container-page navbar min-h-16 px-0">
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-square btn-sm" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {linkItems}
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{linkItems}</ul>
        </div>

        <div className="navbar-end gap-2">
          <ThemeToggle />
          {isPending ? (
            <span className="skeleton size-9 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Account menu">
                <UserAvatar name={user.name} image={user.image} />
              </button>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                <li className="menu-title">
                  <span className="truncate normal-case text-base-content">{user.name}</span>
                  <span className="truncate text-xs font-normal">{user.email}</span>
                </li>
                <li>
                  <Link href="/dashboard">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/bookings">
                    <CalendarCheck className="size-4" /> My bookings
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/listings">
                    <Warehouse className="size-4" /> My studios
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/listings/new">
                    <Plus className="size-4" /> List a studio
                  </Link>
                </li>
                <div className="divider my-1" />
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut className="size-4" /> Log out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
