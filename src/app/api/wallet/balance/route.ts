import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { prisma } from "@/lib/prisma";
import { getConnection } from "@/lib/solana";
import { obtenerSaldoUSDT } from "@/lib/token";

export async function GET(req: NextRequest) {
  const privyUserId = req.nextUrl.searchParams.get("privyUserId");
  if (!privyUserId) {
    return NextResponse.json({ error: "Falta privyUserId" }, { status: 400 });
  }

  const usuario = await prisma.user.findUnique({ where: { privyUserId } });
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  try {
    const connection = getConnection();
    const saldo = await obtenerSaldoUSDT(
      connection,
      new PublicKey(usuario.direccionSolana)
    );
    return NextResponse.json({ saldo });
  } catch {
    return NextResponse.json(
      { error: "No pudimos consultar tu saldo. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
