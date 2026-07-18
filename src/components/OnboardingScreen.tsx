"use client";

import { useState } from "react";

export function OnboardingScreen({
  onCompletado,
}: {
  onCompletado: (nombre: string, cedula: string) => Promise<void>;
}) {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nombre.trim().length < 2) {
      setError("Ingresa tu nombre completo");
      return;
    }
    if (!/^\d{10}$/.test(cedula)) {
      setError("La cédula debe tener 10 dígitos");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await onCompletado(nombre.trim(), cedula);
    } catch {
      setError("No pudimos guardar tus datos. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-extrabold">
        Completa tu perfil
      </h1>
      <p className="mt-2 text-sm text-muted">
        Necesitamos algunos datos para activar tu cuenta.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            Nombre completo
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. María Fernanda Pérez"
            className="mt-2 w-full rounded-xl bg-card2 px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
            Cédula
          </label>
          <input
            value={cedula}
            onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
            placeholder="1234567890"
            inputMode="numeric"
            maxLength={10}
            className="mt-2 w-full rounded-xl bg-card2 px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>

        {error && <p className="text-sm text-red">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-4 w-full rounded-xl bg-accent py-3 font-display text-sm font-bold text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {enviando ? "Guardando…" : "Continuar"}
        </button>
      </form>
    </main>
  );
}
