"use client";

import { useWalletStore } from "@/store/wallet-store";
import { formatAmount } from "@/lib/format";

export function Movements() {
  const movimientos = useWalletStore((s) => s.movimientos);
  const cargandoMovimientos = useWalletStore((s) => s.cargandoMovimientos);

  return (
    <div className="mt-6 px-5 pb-28">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Movimientos recientes
      </p>
      <div className="mt-3 divide-y divide-[rgba(255,255,255,0.05)] rounded-app bg-card">
        {!cargandoMovimientos && movimientos.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted">
            Aún no tienes movimientos
          </p>
        )}
        {cargandoMovimientos && (
          <p className="px-4 py-6 text-center text-sm text-muted">Cargando…</p>
        )}
        {movimientos.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card2 text-lg">
              {m.icono}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{m.nombre}</p>
              <p className="text-xs text-muted">{m.subtitulo}</p>
            </div>
            <p
              className={`font-display text-sm font-bold ${
                m.tipo === "entrada" ? "text-green" : "text-ink"
              }`}
            >
              {m.tipo === "entrada" ? "+" : "−"}
              {formatAmount(m.monto)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
