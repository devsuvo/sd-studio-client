"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "./ui";

/**
 * Waits for the session to load before deciding anything, so a logged-in user
 * who reloads a private page sees a spinner — never a bounce to /login.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, router, pathname]);

  if (isPending || !session) return <Spinner label="Checking your session" />;
  return <>{children}</>;
}
