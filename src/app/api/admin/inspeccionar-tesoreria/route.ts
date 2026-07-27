import { NextResponse } from "next/server";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { getConnection, getFeePayerKeypair } from "@/lib/solana";

/**
 * TEMPORAL: lista los token accounts (SPL y Token-2022) de la wallet de
 * tesorería en devnet, para confirmar el mint address real de un token
 * recibido por airdrop (ej. PYUSD) sin arriesgarnos a adivinarlo.
 * Visitar una sola vez desde el navegador y luego eliminar este archivo.
 */
export async function GET() {
  try {
    const connection = getConnection();
    const feePayer = getFeePayerKeypair();

    const [spl, token2022] = await Promise.all([
      connection.getParsedTokenAccountsByOwner(feePayer.publicKey, {
        programId: TOKEN_PROGRAM_ID,
      }),
      connection.getParsedTokenAccountsByOwner(feePayer.publicKey, {
        programId: TOKEN_2022_PROGRAM_ID,
      }),
    ]);

    const formatear = (cuentas: typeof spl.value) =>
      cuentas.map((c) => ({
        pubkey: c.pubkey.toBase58(),
        mint: c.account.data.parsed.info.mint,
        monto: c.account.data.parsed.info.tokenAmount.uiAmountString,
        decimales: c.account.data.parsed.info.tokenAmount.decimals,
      }));

    return NextResponse.json({
      tesoreria: feePayer.publicKey.toBase58(),
      tokenAccounts: formatear(spl.value),
      token2022Accounts: formatear(token2022.value),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 502 }
    );
  }
}
