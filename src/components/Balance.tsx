"use client";

import { useWalletStore } from "@/store/wallet-store";
import { formatUSD } from "@/lib/format";

export function Balance() {
  const saldoUSD = useWalletStore((s) => s.saldoUSD);
  const { whole, cents } = formatUSD(saldoUSD);

  return (
    <div className="px-5 pt-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Saldo disponible
      </p>
      <p className="mt-2 font-display text-[44px] font-extrabold leading-none tracking-tight">
        {whole}
        <span className="text-2xl font-semibold text-muted">.{cents}</span>
      </p>
    </div>
  );
}
