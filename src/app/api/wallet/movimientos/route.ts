import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const privyUserId = req.nextUrl.searchParams.get("privyUserId");
  if (!privyUserId) {
    return NextResponse.json({ error: "Falta privyUserId" }, { status: 400 });
  }

  const usuario = await prisma.user.findUnique({ where: { privyUserId } });
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const transacciones = await prisma.transaction.findMany({
    where: {
      OR: [{ deUserId: usuario.id }, { paraUserId: usuario.id }],
    },
    include: { de: true, para: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const movimientos = transacciones.map((t) => {
    if (t.tipo === "RECARGA") {
      return {
        id: t.id,
        nombre: "Recarga",
        subtitulo: "Depósito de prueba",
        monto: Number(t.monto),
        tipo: "entrada" as const,
        icono: "↓",
      };
    }

    const esRemitente = t.deUserId === usuario.id;
    return {
      id: t.id,
      nombre: esRemitente
        ? t.para.nombre ?? t.para.telefono
        : t.de?.nombre ?? t.de?.telefono ?? "Alguien",
      subtitulo: esRemitente ? "Envío enviado" : "Envío recibido",
      monto: Number(t.monto),
      tipo: esRemitente ? ("salida" as const) : ("entrada" as const),
      icono: esRemitente ? "↑" : "↓",
    };
  });

  return NextResponse.json({ movimientos });
}
