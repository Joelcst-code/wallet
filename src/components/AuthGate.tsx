"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { LoginScreen } from "@/components/LoginScreen";
import { OnboardingScreen } from "@/components/OnboardingScreen";

function obtenerDireccionSolana(user: ReturnType<typeof usePrivy>["user"]) {
  const cuenta = user?.linkedAccounts.find(
    (c) => c.type === "wallet" && c.chainType === "solana"
  );
  return cuenta && "address" in cuenta ? cuenta.address : undefined;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const [cargando, setCargando] = useState(true);
  const [onboardingCompleto, setOnboardingCompleto] = useState(false);

  useEffect(() => {
    if (!ready || !authenticated || !user) {
      setCargando(false);
      return;
    }

    const direccionSolana = obtenerDireccionSolana(user);
    if (!direccionSolana) {
      setCargando(false);
      return;
    }

    fetch(`/api/usuarios?privyUserId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOnboardingCompleto(Boolean(data.usuario?.nombre));
      })
      .catch(() => setOnboardingCompleto(false))
      .finally(() => setCargando(false));
  }, [ready, authenticated, user]);

  if (!ready || cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">Cargando…</p>
      </main>
    );
  }

  if (!authenticated) {
    return <LoginScreen />;
  }

  const direccionSolana = obtenerDireccionSolana(user);

  if (!onboardingCompleto) {
    return (
      <OnboardingScreen
        onCompletado={async (nombre, cedula) => {
          await fetch("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              privyUserId: user!.id,
              telefono: user!.phone?.number ?? "",
              direccionSolana,
              nombre,
              cedula,
            }),
          });
          setOnboardingCompleto(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
