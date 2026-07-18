"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LoginScreen() {
  const { login } = usePrivy();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-3xl font-extrabold tracking-tight">
        pag<span className="text-accent">ora</span>
      </div>
      <p className="mt-3 text-sm text-muted">
        Envía y recibe dinero fácil, rápido y seguro.
      </p>
      <button
        onClick={login}
        className="mt-10 w-full rounded-xl bg-accent py-3 font-display text-sm font-bold text-accent-ink transition-transform hover:-translate-y-0.5"
      >
        Iniciar sesión
      </button>
      <p className="mt-4 text-xs text-muted">
        Ingresa con tu correo o número celular. No necesitas saber de cripto.
      </p>
    </main>
  );
}
