"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

interface WishlistCtx {
  saved: Set<string>;
  toggle: (studioId: string, title?: string) => Promise<void>;
}

const Ctx = createContext<WishlistCtx>({ saved: new Set(), toggle: async () => {} });

/** Loads the signed-in user's saved studio ids once so every heart icon knows its state. */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) {
      setSaved(new Set());
      return;
    }
    api<{ ids: string[] }>("/api/wishlist", { auth: true })
      .then(({ ids }) => setSaved(new Set(ids)))
      .catch(() => setSaved(new Set()));
  }, [userId]);

  const toggle = useCallback(
    async (studioId: string, title = "Studio") => {
      if (!userId) {
        toast.info("Log in to save studios to your wishlist.");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      // Optimistic update, rolled back if the request fails.
      const wasSaved = saved.has(studioId);
      const flip = (on: boolean) =>
        setSaved((prev) => {
          const next = new Set(prev);
          if (on) next.add(studioId);
          else next.delete(studioId);
          return next;
        });
      flip(!wasSaved);
      try {
        const { saved: nowSaved } = await api<{ saved: boolean }>(`/api/wishlist/${studioId}`, { method: "POST", auth: true });
        flip(nowSaved);
        toast.success(nowSaved ? `${title} saved to your wishlist.` : `${title} removed from your wishlist.`);
      } catch (e) {
        flip(wasSaved);
        toast.error((e as Error).message);
      }
    },
    [userId, saved, router, pathname],
  );

  return <Ctx.Provider value={{ saved, toggle }}>{children}</Ctx.Provider>;
}

export const useWishlist = () => useContext(Ctx);

export function HeartButton({ studioId, title, className = "" }: { studioId: string; title: string; className?: string }) {
  const { saved, toggle } = useWishlist();
  const isSaved = saved.has(studioId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(studioId, title);
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      className={`btn btn-circle btn-sm border-0 bg-base-100/95 shadow hover:scale-110 ${className}`}
    >
      <Heart className={`size-4 transition ${isSaved ? "fill-error text-error" : "text-base-content/70"}`} />
    </button>
  );
}
