import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@solana/web3.js";
import { prisma } from "@/lib/prisma";
import { getConnection } from "@/lib/solana";

export async function POST(req: NextRequest) {
  const { privyUserId, destinatarioTelefono, monto, transaccionFirmada } =
    await req.json();

  if (!privyUserId || !destinatarioTelefono || !monto || !transaccionFirmada) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const remitente = await prisma.user.findUnique({ where: { privyUserId } });
  const destinatario = await prisma.user.findUnique({
    where: { telefono: destinatarioTelefono },
  });

  if (!remitente || !destinatario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  try {
    const connection = getConnection();
    const tx = Transaction.from(Buffer.from(transaccionFirmada, "base64"));

    const signature = await connection.sendRawTransaction(tx.serialize());
    const { lastValidBlockHeight } = await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      {
        signature,
        blockhash: tx.recentBlockhash!,
        lastValidBlockHeight,
      },
      "confirmed"
    );

    await prisma.transaction.create({
      data: {
        signature,
        tipo: "ENVIO",
        monto,
        deUserId: remitente.id,
        paraUserId: destinatario.id,
      },
    });

    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json(
      { error: "No pudimos completar el envío. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
