/**
 * Script one-off: crea un mint SPL de prueba en devnet que simula USDT
 * (6 decimales, igual que el USDT real), con la wallet de tesorería
 * (FEE_PAYER_KEY) como mint authority.
 *
 * Uso:
 *   npx tsx scripts/crear-mint-usdt-devnet.ts
 *
 * Requiere que FEE_PAYER_KEY (en .env.local) ya tenga SOL de devnet
 * para pagar la renta del mint. Imprime el mint address para copiarlo
 * a USDT_MINT_ADDRESS en .env.local.
 */
import { createMint } from "@solana/spl-token";
import { getConnection, getFeePayerKeypair, USDT_DECIMALS } from "../src/lib/solana";

async function main() {
  const connection = getConnection();
  const feePayer = getFeePayerKeypair();

  console.log("Tesorería:", feePayer.publicKey.toBase58());

  const balance = await connection.getBalance(feePayer.publicKey);
  console.log("Balance SOL de tesorería:", balance / 1e9);
  if (balance === 0) {
    console.error(
      "La tesorería no tiene SOL de devnet. Fondéala en https://faucet.solana.com antes de continuar."
    );
    process.exit(1);
  }

  const mint = await createMint(
    connection,
    feePayer,
    feePayer.publicKey,
    feePayer.publicKey,
    USDT_DECIMALS
  );

  console.log("\nMint USDT de prueba creado:");
  console.log(mint.toBase58());
  console.log("\nCopia esto a .env.local:");
  console.log(`USDT_MINT_ADDRESS=${mint.toBase58()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
