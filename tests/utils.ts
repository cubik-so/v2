import {
  AnchorProvider,
  Program,
  Wallet,
  utils,
  web3,
} from '@coral-xyz/anchor';
import { Cubik, IDL } from '../target/types/cubik';

export const PROGRAM_ID = new web3.PublicKey(
  'D4QbbabmtqmkjJFcE2qnHihuXa4NT7Ap2tqqh5nyCG4T'
);

export function createLocalhostConnection() {
  return new web3.Connection('http://127.0.0.1:8899', 'confirmed');
}

export const SQUADS_PROGRAM_ID = new web3.PublicKey(
  'SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf'
);

function toUtfBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
export const SEED_PREFIX = toUtfBytes('multisig');
export const SEED_MULTISIG = toUtfBytes('multisig');

export const createCubikProgram = (wallet: Wallet): Program<Cubik> => {
  return new Program(
    IDL,
    PROGRAM_ID,
    new AnchorProvider(createLocalhostConnection(), wallet, {
      commitment: 'confirmed',
    })
  ) as unknown as Program<Cubik>;
};

export function generateKeypair() {
  return web3.Keypair.generate();
}

export async function generateFundedKeypair(connection: web3.Connection) {
  const keypair = web3.Keypair.generate();

  const tx = await connection.requestAirdrop(
    keypair.publicKey,
    1 * web3.LAMPORTS_PER_SOL
  );
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });

  return keypair;
}

export const adminPair = () => {
  // return generateFundedKeypair(createLocalhostConnection());

  return web3.Keypair.fromSecretKey(
    utils.bytes.bs58.decode(
      '5aUpHxFFFQAVyp9dvz2pxHkXuFKH1G2huhexHWRRkX4rCvFmbtFpVWowHbLQMatCHgYx8zgCpbS5WMBjauPkr15o'
    )
  );
};
