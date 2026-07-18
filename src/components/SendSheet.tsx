"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/wallet-store";

export function SendSheet() {
  const abierto = useWalletStore((s) => s.sheetEnvioAbierto);
  const cerrarEnvio = useWalletStore((s) => s.cerrarEnvio);
  const enviar = useWalletStore((s) => s.enviar);
  const [destinatario, setDestinatario] = useState("");
  const [monto, setMonto] = useState("");

  if (!abierto) return null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    enviar(destinatario, Number(monto));
    setDestinatario("");
    setMonto("");
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={cerrarEnvio}
        aria-hidden
      />
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-[400px] animate-slide-up rounded-t-[28px] bg-card p-6"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-card2" />
        <h2 className="font-display text-lg font-bold">Enviar dinero</h2>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Celular o alias
        </label>
        <input
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          placeholder="Ej. 099 123 4567"
          required
          className="mt-2 w-full rounded-xl bg-card2 px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">
          Monto (USD)
        </label>
        <input
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
          className="mt-2 w-full rounded-xl bg-card2 px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-accent py-3 font-display text-sm font-bold text-accent-ink transition-transform hover:-translate-y-0.5"
        >
          Enviar ahora
        </button>
      </form>
    </div>
  );
}
