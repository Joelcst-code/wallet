import { create } from "zustand";

export type Movement = {
  id: string;
  nombre: string;
  subtitulo: string;
  monto: number;
  tipo: "entrada" | "salida";
  icono: string;
};

type Toast = { id: string; mensaje: string } | null;

type WalletState = {
  saldoUSD: number;
  saldoUSDC: number;
  cargandoSaldo: boolean;
  cargandoMovimientos: boolean;
  modoCripto: boolean;
  movimientos: Movement[];
  toast: Toast;
  sheetEnvioAbierto: boolean;
  toggleModoCripto: () => void;
  abrirEnvio: () => void;
  cerrarEnvio: () => void;
  mostrarToast: (mensaje: string) => void;
  cargarSaldo: (privyUserId: string) => Promise<void>;
  cargarMovimientos: (privyUserId: string) => Promise<void>;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  saldoUSD: 0,
  saldoUSDC: 342.18,
  cargandoSaldo: true,
  cargandoMovimientos: true,
  modoCripto: false,
  sheetEnvioAbierto: false,
  toast: null,
  movimientos: [],
  toggleModoCripto: () => set((s) => ({ modoCripto: !s.modoCripto })),
  abrirEnvio: () => set({ sheetEnvioAbierto: true }),
  cerrarEnvio: () => set({ sheetEnvioAbierto: false }),
  mostrarToast: (mensaje) => {
    const id = crypto.randomUUID();
    set({ toast: { id, mensaje } });
    setTimeout(() => {
      if (get().toast?.id === id) set({ toast: null });
    }, 2200);
  },
  cargarSaldo: async (privyUserId) => {
    set({ cargandoSaldo: true });
    try {
      const res = await fetch(`/api/wallet/balance?privyUserId=${privyUserId}`);
      const data = await res.json();
      set({ saldoUSD: data.saldo ?? 0 });
    } finally {
      set({ cargandoSaldo: false });
    }
  },
  cargarMovimientos: async (privyUserId) => {
    set({ cargandoMovimientos: true });
    try {
      const res = await fetch(`/api/wallet/movimientos?privyUserId=${privyUserId}`);
      const data = await res.json();
      set({ movimientos: data.movimientos ?? [] });
    } finally {
      set({ cargandoMovimientos: false });
    }
  },
}));
