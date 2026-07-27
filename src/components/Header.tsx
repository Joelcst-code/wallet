"use client";

import { useSesion } from "@/lib/use-sesion";

function obtenerIniciales(nombre: string | null) {
  if (!nombre) return "";
  const partes = nombre.trim().split(/\s+/);
  return partes
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Header() {
  const { nombre } = useSesion();

  return (
    <header className="flex items-center justify-between px-5 pt-6">
      <div className="font-display text-xl font-extrabold tracking-tight">
        pag<span className="text-accent">ora</span>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-500 font-display text-sm font-bold text-accent-ink">
        {obtenerIniciales(nombre)}
      </div>
    </header>
  );
}
