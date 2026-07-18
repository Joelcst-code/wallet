"use client";

import { useWalletStore } from "@/store/wallet-store";
import { formatAmount } from "@/lib/format";

export function CryptoCard() {
  const modoCripto = useWalletStore((s) => s.modoCripto);
  const saldoUSDC = useWalletStore((s) => s.saldoUSDC);
  const mostrarToast = useWalletStore((s) => s.mostrarToast);

  if (!modoCripto) return null;

  return (
    <div className="mx-5 mt-5 animate-fade-slide rounded-app border border-[rgba(155,109,255,0.35)] bg-gradient-to-br from-[#231A3E] to-card p-5">
      <span className="inline-block rounded-full bg-[rgba(155,109,255,0.15)] px-3 py-1 text-xs font-semibold text-sol">
        ◎ Solana · USDC
      </span>
      <p className="mt-4 font-display text-2xl font-bold">
        {saldoUSDC.toFixed(2)} USDC
      </p>
      <p className="text-sm text-muted">≈ {formatAmount(saldoUSDC)}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => mostrarToast("Conversión disponible pronto")}
          className="flex-1 rounded-xl bg-sol py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Convertir
        </button>
        <button
          onClick={() => mostrarToast("Envío on-chain disponible pronto")}
          className="flex-1 rounded-xl border border-[rgba(155,109,255,0.4)] bg-transparent py-2.5 text-sm font-semibold text-sol transition-transform hover:-translate-y-0.5"
        >
          Enviar on-chain
        </button>
      </div>
    </div>
  );
}
