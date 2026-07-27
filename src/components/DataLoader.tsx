"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/store/wallet-store";
import { useSesion } from "@/lib/use-sesion";

export function DataLoader() {
  const { privyUserId } = useSesion();
  const cargarSaldo = useWalletStore((s) => s.cargarSaldo);
  const cargarMovimientos = useWalletStore((s) => s.cargarMovimientos);

  useEffect(() => {
    if (!privyUserId) return;
    cargarSaldo(privyUserId);
    cargarMovimientos(privyUserId);
  }, [privyUserId, cargarSaldo, cargarMovimientos]);

  return null;
}
