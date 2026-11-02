"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Bar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const [active, setActive] = useState(false);

  // Start on internal link clicks…
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      setActive(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // …and finish once the new route has rendered.
  useEffect(() => {
    setActive(false);
  }, [pathname, params]);

  return active ? <div className="route-progress" aria-hidden /> : null;
}

/** Thin gradient bar at the top of the page during route transitions. */
export default function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
