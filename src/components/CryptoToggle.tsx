"use client";

import { useWalletStore } from "@/store/wallet-store";

export function CryptoToggle() {
  const modoCripto = useWalletStore((s) => s.modoCripto);
  const toggleModoCripto = useWalletStore((s) => s.toggleModoCripto);

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[400px] -translate-x-1/2 border-t border-[rgba(255,255,255,0.05)] bg-bg/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">Modo cripto</span>
        <button
          role="switch"
          aria-checked={modoCripto}
          onClick={toggleModoCripto}
          className={`relative h-7 w-12 rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
            modoCripto ? "bg-sol" : "bg-card2"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-ink transition-transform duration-300 ${
              modoCripto ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
