"use client";

import { AlertTriangle, HelpCircle } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "primary" | "error";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Promise-based replacement for window.confirm, rendered as a styled modal. */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (options && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [options]);

  const close = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    dialogRef.current?.close();
  };

  const danger = options?.tone === "error";
  const Icon = danger ? AlertTriangle : HelpCircle;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        className="modal modal-bottom sm:modal-middle"
        onClose={() => {
          // Escape key or backdrop: treat as cancel.
          resolver.current?.(false);
          resolver.current = null;
        }}
      >
        {options && (
          <div className="modal-box">
            <div className="flex gap-4">
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full ${
                  danger ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">{options.title}</h3>
                <div className="mt-2 text-sm text-base-content/75">{options.message}</div>
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => close(false)}>
                {options.cancelText ?? "Go back"}
              </button>
              <button
                type="button"
                className={`btn ${danger ? "btn-error" : "btn-primary"}`}
                onClick={() => close(true)}
                autoFocus
              >
                {options.confirmText ?? "Confirm"}
              </button>
            </div>
          </div>
        )}
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </ConfirmContext.Provider>
  );
}
