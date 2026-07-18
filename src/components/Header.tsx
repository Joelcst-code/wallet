"use client";

import { useWalletStore } from "@/store/wallet-store";

export function Header() {
  const iniciales = useWalletStore((s) => s.iniciales);

  return (
    <header className="flex items-center justify-between px-5 pt-6">
      <div className="font-display text-xl font-extrabold tracking-tight">
        pag<span className="text-accent">ora</span>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-500 font-display text-sm font-bold text-accent-ink">
        {iniciales}
      </div>
    </header>
  );
}
