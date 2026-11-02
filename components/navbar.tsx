"use client";

import { CalendarCheck, Heart, LayoutDashboard, LogOut, Menu, PlusCircle, Warehouse } from "lucide-react";
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
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const ACCOUNT_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Warehouse },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/saved", label: "Saved Studios", icon: Heart },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const confirm = useConfirm();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  const handleLogout = async () => {
    (document.activeElement as HTMLElement | null)?.blur();
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

  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/85 backdrop-blur">
      <nav className="container-page navbar min-h-16 px-0">
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-square btn-sm" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={isActive(l.href) ? "menu-active" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-6">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 text-sm font-medium transition hover:text-primary ${
                      active ? "text-primary" : "text-base-content/80"
                    }`}
                  >
                    {l.label}
                    {/* Active route indicator */}
                    <span
                      className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-primary transition-transform ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <ThemeToggle />
          {isPending ? (
            <span className="skeleton size-9 rounded-full" />
          ) : user ? (
            // Opens on hover (desktop) and on click/tap (touch + keyboard).
            <div className="dropdown dropdown-end dropdown-hover">
              <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Account menu">
                <UserAvatar name={user.name} image={user.image} />
              </button>
              <div tabIndex={0} className="dropdown-content z-50 pt-2">
                <ul className="menu w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                  <li className="pointer-events-none mb-1 border-b border-base-300 px-3 pb-2 pt-1">
                    <span className="block truncate p-0 font-semibold">{user.name}</span>
                    <span className="block truncate p-0 text-xs text-base-content/60">{user.email}</span>
                  </li>
                  {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link href={href} className={pathname === href ? "menu-active" : ""}>
                        <Icon className="size-4" /> {label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 border-t border-base-300 pt-1">
                    <button onClick={handleLogout} className="text-error">
                      <LogOut className="size-4" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
