"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth/solana";
import { useWalletStore } from "@/store/wallet-store";
import { useSesion } from "@/lib/use-sesion";

export function SendSheet() {
  const abierto = useWalletStore((s) => s.sheetEnvioAbierto);
  const cerrarEnvio = useWalletStore((s) => s.cerrarEnvio);
  const mostrarToast = useWalletStore((s) => s.mostrarToast);
  const cargarSaldo = useWalletStore((s) => s.cargarSaldo);
  const cargarMovimientos = useWalletStore((s) => s.cargarMovimientos);
  const { privyUserId, direccionSolana } = useSesion();
  const { wallets } = useWallets();

  const [destinatario, setDestinatario] = useState("");
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!abierto) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const montoNumero = Number(monto);
    if (!privyUserId || !destinatario || !montoNumero || montoNumero <= 0) {
      setError("Ingresa un destinatario y un monto válido");
      return;
    }

    const wallet = wallets.find((w) => w.address === direccionSolana);
    if (!wallet) {
      setError("No encontramos tu wallet. Intenta de nuevo.");
      return;
    }

    setEnviando(true);
    try {
      const resPreparar = await fetch("/api/wallet/enviar/preparar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privyUserId,
          destinatarioTelefono: destinatario,
          monto: montoNumero,
        }),
      });
      const dataPreparar = await resPreparar.json();
      if (!resPreparar.ok) {
        setError(dataPreparar.error ?? "No pudimos preparar el envío");
        return;
      }

      const bytesSinFirmar = Uint8Array.from(
        atob(dataPreparar.transaccion),
        (c) => c.charCodeAt(0)
      );

      const { signedTransaction } = await wallet.signTransaction({
        transaction: bytesSinFirmar,
        chain: "solana:devnet",
      });

      const base64Firmada = btoa(
        Array.from(signedTransaction, (b) => String.fromCharCode(b)).join("")
      );

      const resConfirmar = await fetch("/api/wallet/enviar/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privyUserId,
          destinatarioTelefono: destinatario,
          monto: montoNumero,
          transaccionFirmada: base64Firmada,
        }),
      });
      const dataConfirmar = await resConfirmar.json();
      if (!resConfirmar.ok) {
        setError(dataConfirmar.error ?? "No pudimos completar el envío");
        return;
      }

      await Promise.all([
        cargarSaldo(privyUserId),
        cargarMovimientos(privyUserId),
      ]);
      setDestinatario("");
      setMonto("");
      cerrarEnvio();
      mostrarToast("Enviado con éxito");
    } catch {
      setError("No pudimos completar el envío. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
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

        {error && <p className="mt-3 text-sm text-red">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-xl bg-accent py-3 font-display text-sm font-bold text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {enviando ? "Enviando…" : "Enviar ahora"}
        </button>
      </form>
    </div>
  );
}
