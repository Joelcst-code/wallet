import { NextResponse } from "next/server";
import { getConnection, getFeePayerKeypair } from "@/lib/solana";

/**
 * TEMPORAL: solicita un airdrop de SOL de devnet a la wallet de tesorería.
 * Visitar una sola vez desde el navegador y luego eliminar este archivo.
 */
export async function GET() {
  try {
    const connection = getConnection();
    const feePayer = getFeePayerKeypair();

    const signature = await connection.requestAirdrop(
      feePayer.publicKey,
      2_000_000_000 // 2 SOL en lamports
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
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 502 }
    );
  }
}
