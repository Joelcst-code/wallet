import { Connection, Keypair, PublicKey } from "@solana/web3.js";

export function getConnection() {
  return new Connection(process.env.RPC_URL as string, "confirmed");
}

export function getFeePayerKeypair() {
  const raw = process.env.FEE_PAYER_KEY;
  if (!raw) throw new Error("Falta configurar FEE_PAYER_KEY");
  const secretKey = Uint8Array.from(JSON.parse(raw));
  return Keypair.fromSecretKey(secretKey);
}

export function getUsdtMint() {
  const mint = process.env.USDT_MINT_ADDRESS;
  if (!mint) throw new Error("Falta configurar USDT_MINT_ADDRESS");
  return new PublicKey(mint);
}

export const USDT_DECIMALS = 6;
