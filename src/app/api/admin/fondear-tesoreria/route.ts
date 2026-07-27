import { NextResponse } from "next/server";
import { getConnection, getFeePayerKeypair } from "@/lib/solana";

/**
 * TEMPORAL: solicita un airdrop de SOL de devnet a la wallet de tesorería.
 * Visitar una sola vez desde el navegador y luego eliminar este archivo.
 */

const MONTO_SOL = 0.5;
const MAX_INTENTOS = 3;
const ESPERA_MS = 10_000;

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  const connection = getConnection();
  const feePayer = getFeePayerKeypair();

  let ultimoError: unknown;

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    try {
      const signature = await connection.requestAirdrop(
        feePayer.publicKey,
        MONTO_SOL * 1_000_000_000
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      const balance = await connection.getBalance(feePayer.publicKey);

      return NextResponse.json({
        tesoreria: feePayer.publicKey.toBase58(),
        signature,
        balanceSOL: balance / 1_000_000_000,
        intentos: intento,
      });
    } catch (err) {
      ultimoError = err;
      if (intento < MAX_INTENTOS) await esperar(ESPERA_MS);
    }
  }

  return NextResponse.json(
    {
      error:
        ultimoError instanceof Error
          ? ultimoError.message
          : "Error desconocido",
      intentos: MAX_INTENTOS,
    },
    { status: 502 }
  );
}
