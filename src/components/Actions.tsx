"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/wallet-store";
import { useSesion } from "@/lib/use-sesion";

const acciones = [
  { label: "Enviar", icono: "↑", primaria: true },
  { label: "Recargar", icono: "＋", primaria: false },
  { label: "Cobrar", icono: "↓", primaria: false },
  { label: "Más", icono: "•••", primaria: false },
];

export function Actions() {
  const abrirEnvio = useWalletStore((s) => s.abrirEnvio);
  const mostrarToast = useWalletStore((s) => s.mostrarToast);
  const cargarSaldo = useWalletStore((s) => s.cargarSaldo);
  const cargarMovimientos = useWalletStore((s) => s.cargarMovimientos);
  const { privyUserId } = useSesion();
  const [recargando, setRecargando] = useState(false);

  async function recargar() {
    if (!privyUserId || recargando) return;
    setRecargando(true);
    try {
      const res = await fetch("/api/wallet/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privyUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarToast(data.error ?? "No pudimos recargar tu saldo");
        return;
      }
      await Promise.all([
        cargarSaldo(privyUserId),
        cargarMovimientos(privyUserId),
      ]);
      mostrarToast("Recarga acreditada con éxito");
    } catch {
      mostrarToast("No pudimos recargar tu saldo");
    } finally {
      setRecargando(false);
    }
  }

  function onClick(label: string) {
    if (label === "Enviar") {
      abrirEnvio();
    } else if (label === "Recargar") {
      recargar();
    } else {
      mostrarToast(`${label} estará disponible pronto`);
    }
  }

  return (
    <div className="mt-8 grid grid-cols-4 gap-3 px-5">
      {acciones.map((a) => (
        <button
          key={a.label}
          onClick={() => onClick(a.label)}
          disabled={a.label === "Recargar" && recargando}
          className="flex flex-col items-center gap-2 rounded-app bg-card p-3 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60"
        >
          <span
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-xl text-lg ${
              a.primaria ? "bg-accent text-accent-ink" : "bg-card2 text-accent"
            }`}
          >
            {a.icono}
          </span>
          <span className="text-xs font-medium text-ink">
            {a.label === "Recargar" && recargando ? "Recargando…" : a.label}
          </span>
        </button>
      ))}
    </div>
  );
}
