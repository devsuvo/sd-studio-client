"use client";

import { Toaster } from "sonner";
import { ConfirmProvider } from "./confirm-dialog";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmProvider>
      {children}
      <Toaster position="top-center" richColors closeButton duration={3500} />
    </ConfirmProvider>
  );
}
