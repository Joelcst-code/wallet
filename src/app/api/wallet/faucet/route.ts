import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import {
  transfer,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { prisma } from "@/lib/prisma";
import { getConnection, getFeePayerKeypair, getUsdtMint } from "@/lib/solana";
import { montoAUnidades, unidadesAMonto } from "@/lib/token";

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

    // La recarga sale del balance de la propia tesorería (ya no somos mint
    // authority de PYUSD, es un token real con oferta fija), no de un mint
    // arbitrario. Si a la tesorería se le acaban los fondos de prueba, hay
    // que recargarla manualmente desde un faucet externo de PYUSD.
    const ataTesoreria = await getAssociatedTokenAddress(
      mint,
      feePayer.publicKey
    );
    const cuentaTesoreria = await getAccount(connection, ataTesoreria);
    const saldoTesoreria = unidadesAMonto(cuentaTesoreria.amount);

    if (saldoTesoreria < MONTO_RECARGA) {
      return NextResponse.json(
        {
          error:
            "La tesorería no tiene fondos de prueba suficientes en este momento",
        },
        { status: 503 }
      );
    }

    const ataUsuario = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      mint,
      owner
    );

    const signature = await transfer(
      connection,
      feePayer,
      ataTesoreria,
      ataUsuario.address,
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
