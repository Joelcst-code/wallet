"use client";

import { useWalletStore } from "@/store/wallet-store";

export function Toast() {
  const toast = useWalletStore((s) => s.toast);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="fixed left-1/2 top-6 z-50 animate-toast-in rounded-full bg-green px-4 py-2 text-sm font-semibold text-accent-ink"
    >
      ✓ {toast.mensaje}
    </div>
  );
}
