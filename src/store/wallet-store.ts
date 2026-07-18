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
  nombre: string;
  iniciales: string;
  saldoUSD: number;
  saldoUSDC: number;
  modoCripto: boolean;
  movimientos: Movement[];
  toast: Toast;
  sheetEnvioAbierto: boolean;
  toggleModoCripto: () => void;
  abrirEnvio: () => void;
  cerrarEnvio: () => void;
  enviar: (destinatario: string, monto: number) => void;
  mostrarToast: (mensaje: string) => void;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  nombre: "Joel Castro",
  iniciales: "JC",
  saldoUSD: 1284.5,
  saldoUSDC: 342.18,
  modoCripto: false,
  sheetEnvioAbierto: false,
  toast: null,
  movimientos: [
    {
      id: "1",
      nombre: "María Fernanda",
      subtitulo: "Envío recibido",
      monto: 45.0,
      tipo: "entrada",
      icono: "↓",
    },
    {
      id: "2",
      nombre: "Farmacia Cruz Azul",
      subtitulo: "Pago con garantía",
      monto: 18.75,
      tipo: "salida",
      icono: "🏪",
    },
    {
      id: "3",
      nombre: "Recarga",
      subtitulo: "Depósito",
      monto: 100.0,
      tipo: "entrada",
      icono: "↓",
    },
    {
      id: "4",
      nombre: "Carlos Mendoza",
      subtitulo: "Envío enviado",
      monto: 30.0,
      tipo: "salida",
      icono: "↑",
    },
  ],
  toggleModoCripto: () => set((s) => ({ modoCripto: !s.modoCripto })),
  abrirEnvio: () => set({ sheetEnvioAbierto: true }),
  cerrarEnvio: () => set({ sheetEnvioAbierto: false }),
  enviar: (destinatario, monto) => {
    if (!destinatario || !monto || monto <= 0) return;
    set((s) => ({
      saldoUSD: s.saldoUSD - monto,
      sheetEnvioAbierto: false,
      movimientos: [
        {
          id: crypto.randomUUID(),
          nombre: destinatario,
          subtitulo: "Envío enviado",
          monto,
          tipo: "salida",
          icono: "↑",
        },
        ...s.movimientos,
      ],
    }));
    get().mostrarToast("Enviado con éxito");
  },
  mostrarToast: (mensaje) => {
    const id = crypto.randomUUID();
    set({ toast: { id, mensaje } });
    setTimeout(() => {
      if (get().toast?.id === id) set({ toast: null });
    }, 2200);
  },
}));
