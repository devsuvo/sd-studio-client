"use client";

import { Toaster } from "sonner";
import { ConfirmProvider } from "./confirm-dialog";
import { WishlistProvider } from "./wishlist";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmProvider>
      <WishlistProvider>{children}</WishlistProvider>
      <Toaster position="top-center" richColors closeButton duration={3500} />
    </ConfirmProvider>
  );
}
