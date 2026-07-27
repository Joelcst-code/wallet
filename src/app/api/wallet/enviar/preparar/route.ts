import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { prisma } from "@/lib/prisma";
import { getConnection, getFeePayerKeypair } from "@/lib/solana";
import { construirTransferenciaSinFirmar, obtenerSaldoUSDT } from "@/lib/token";

export async function POST(req: NextRequest) {
  const { privyUserId, destinatarioTelefono, monto } = await req.json();

  if (!privyUserId || !destinatarioTelefono || !monto || monto <= 0) {
    return NextResponse.json(
      { error: "Ingresa un destinatario y un monto válido" },
      { status: 400 }
    );
  }

  const remitente = await prisma.user.findUnique({ where: { privyUserId } });
  if (!remitente) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const destinatario = await prisma.user.findUnique({
    where: { telefono: destinatarioTelefono },
  });
  if (!destinatario) {
    return NextResponse.json(
      { error: "No encontramos a ese destinatario en Pagora" },
      { status: 404 }
    );
  }
  if (destinatario.id === remitente.id) {
    return NextResponse.json(
      { error: "No puedes enviarte dinero a ti mismo" },
      { status: 400 }
    );
  }

  try {
    const connection = getConnection();
    const feePayer = getFeePayerKeypair();
    const origen = new PublicKey(remitente.direccionSolana);
    const destino = new PublicKey(destinatario.direccionSolana);

    const saldo = await obtenerSaldoUSDT(connection, origen);
    if (saldo < monto) {
      return NextResponse.json(
        { error: "No tienes saldo suficiente para este envío" },
        { status: 400 }
      );
    }

    const tx = await construirTransferenciaSinFirmar({
      connection,
      feePayer,
      origen,
      destino,
      monto,
    });

    tx.partialSign(feePayer);

    const serializada = tx.serialize({ requireAllSignatures: false });

    return NextResponse.json({
      transaccion: serializada.toString("base64"),
      destinatarioNombre: destinatario.nombre ?? destinatarioTelefono,
    });
  } catch {
    return NextResponse.json(
      { error: "No pudimos preparar el envío. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
