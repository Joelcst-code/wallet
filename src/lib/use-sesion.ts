"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export function obtenerDireccionSolana(user: ReturnType<typeof usePrivy>["user"]) {
  const cuenta = user?.linkedAccounts.find(
    (c) => c.type === "wallet" && c.chainType === "solana"
  );
  return cuenta && "address" in cuenta ? cuenta.address : undefined;
}

export function useSesion() {
  const { user } = usePrivy();
  const [nombre, setNombre] = useState<string | null>(null);
  const privyUserId = user?.id ?? null;

  useEffect(() => {
    if (!privyUserId) return;
    fetch(`/api/usuarios?privyUserId=${privyUserId}`)
      .then((r) => r.json())
      .then((data) => setNombre(data.usuario?.nombre ?? null))
      .catch(() => setNombre(null));
  }, [privyUserId]);

  return {
    privyUserId,
    telefono: user?.phone?.number ?? null,
    direccionSolana: obtenerDireccionSolana(user) ?? null,
    nombre,
  };
}
