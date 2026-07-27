import {
  getAssociatedTokenAddress,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { getUsdtMint, USDT_DECIMALS } from "./solana";

export async function obtenerSaldoUSDT(
  connection: Connection,
  owner: PublicKey
): Promise<number> {
  const mint = getUsdtMint();
  const ata = await getAssociatedTokenAddress(mint, owner);

  try {
    const cuenta = await getAccount(connection, ata);
    return Number(cuenta.amount) / 10 ** USDT_DECIMALS;
  } catch (err) {
    if (
      err instanceof TokenAccountNotFoundError ||
      err instanceof TokenInvalidAccountOwnerError
    ) {
      return 0;
    }
    throw err;
  }
}

export function montoAUnidades(monto: number): bigint {
  return BigInt(Math.round(monto * 10 ** USDT_DECIMALS));
}

export function unidadesAMonto(unidades: bigint | number): number {
  return Number(unidades) / 10 ** USDT_DECIMALS;
}

export async function construirTransferenciaSinFirmar({
  connection,
  feePayer,
  origen,
  destino,
  monto,
}: {
  connection: Connection;
  feePayer: Keypair;
  origen: PublicKey;
  destino: PublicKey;
  monto: number;
}): Promise<Transaction> {
  const mint = getUsdtMint();

  const ataDestino = await getOrCreateAssociatedTokenAccount(
    connection,
    feePayer,
    mint,
    destino
  );
  const ataOrigen = await getAssociatedTokenAddress(mint, origen);

  const instruccion = createTransferInstruction(
    ataOrigen,
    ataDestino.address,
    origen,
    montoAUnidades(monto)
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const tx = new Transaction({
    feePayer: feePayer.publicKey,
    blockhash,
    lastValidBlockHeight,
  }).add(instruccion);

  return tx;
}
