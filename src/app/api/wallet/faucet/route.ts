import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { prisma } from "@/lib/prisma";
import { getConnection, getFeePayerKeypair, getUsdtMint } from "@/lib/solana";
import { montoAUnidades } from "@/lib/token";

const MONTO_RECARGA = 50;

export async function POST(req: NextRequest) {
  const { privyUserId } = await req.json();
  if (!privyUserId) {
    return NextResponse.json({ error: "Falta privyUserId" }, { status: 400 });
  }

  const usuario = await prisma.user.findUnique({ where: { privyUserId } });
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  try {
    const connection = getConnection();
    const feePayer = getFeePayerKeypair();
    const mint = getUsdtMint();
    const owner = new PublicKey(usuario.direccionSolana);

    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      mint,
      owner
    );

    const signature = await mintTo(
      connection,
      feePayer,
      mint,
      ata.address,
      feePayer,
      montoAUnidades(MONTO_RECARGA)
    );

    await prisma.transaction.create({
      data: {
        signature,
        tipo: "RECARGA",
        monto: MONTO_RECARGA,
        paraUserId: usuario.id,
      },
    });

    return NextResponse.json({ signature, monto: MONTO_RECARGA });
  } catch {
    return NextResponse.json(
      { error: "No pudimos acreditar la recarga. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
