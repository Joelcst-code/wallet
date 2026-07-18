"use client";

import { useWalletStore } from "@/store/wallet-store";

const acciones = [
  { label: "Enviar", icono: "↑", primaria: true },
  { label: "Recargar", icono: "＋", primaria: false },
  { label: "Cobrar", icono: "↓", primaria: false },
  { label: "Más", icono: "•••", primaria: false },
];

export function Actions() {
  const abrirEnvio = useWalletStore((s) => s.abrirEnvio);
  const mostrarToast = useWalletStore((s) => s.mostrarToast);

  function onClick(label: string) {
    if (label === "Enviar") {
      abrirEnvio();
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
          className="flex flex-col items-center gap-2 rounded-app bg-card p-3 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <span
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-xl text-lg ${
              a.primaria ? "bg-accent text-accent-ink" : "bg-card2 text-accent"
            }`}
          >
            {a.icono}
          </span>
          <span className="text-xs font-medium text-ink">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
