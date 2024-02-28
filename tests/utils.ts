import {
  AnchorProvider,
  Program,
  Wallet,
  utils,
  web3,
} from "@coral-xyz/anchor";
import { readFileSync } from "fs";
import path from "path";
import { Cubik, IDL } from "../target/types/cubik";
import * as beet from "@metaplex-foundation/beet";
import * as beetSolana from "@metaplex-foundation/beet-solana";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

export const PROGRAM_ID = new web3.PublicKey(
  "4GgcGdn4mVtudPoX3a4xYv62ed4GKbuqn1AcxU5tU4SD",
);

export function createDevnetConnection() {
  return new web3.Connection("https://api.devnet.solana.com", "confirmed");
}

export const SQUADS_PROGRAM_ID = new web3.PublicKey(
  "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf",
);

function toUtfBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
export const SEED_PREFIX = toUtfBytes("multisig");
export const SEED_MULTISIG = toUtfBytes("multisig");
const SEED_PROGRAM_CONFIG = toUtfBytes("program_config");

export const createCubikProgram = (wallet: Wallet): Program<Cubik> => {
  return new Program(
    IDL,
    PROGRAM_ID,
    new AnchorProvider(createDevnetConnection(), wallet, {
      commitment: "confirmed",
    }),
  ) as unknown as Program<Cubik>;
};

export function getProgramConfigPda({
  programId = PROGRAM_ID,
}: {
  programId?: web3.PublicKey;
}): [web3.PublicKey, number] {
  return web3.PublicKey.findProgramAddressSync(
    [SEED_PREFIX, SEED_PROGRAM_CONFIG],
    SQUADS_PROGRAM_ID,
  );
}

export type ProgramConfigArgs = {
  authority: web3.PublicKey;
  multisigCreationFee: beet.bignum;
  treasury: web3.PublicKey;
  reserved: number[] /* size: 64 */;
};

export const programConfigDiscriminator = [
  196, 210, 90, 231, 144, 149, 140, 63,
];

export class ProgramConfig implements ProgramConfigArgs {
  private constructor(
    readonly authority: web3.PublicKey,
    readonly multisigCreationFee: beet.bignum,
    readonly treasury: web3.PublicKey,
    readonly reserved: number[] /* size: 64 */,
  ) {}

  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [ProgramConfig, number] {
    return ProgramConfig.deserialize(accountInfo.data, offset);
  }

  /**
   * Deserializes the {@link ProgramConfig} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [ProgramConfig, number] {
    return programConfigBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link ProgramConfig} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return programConfigBeet.serialize({
      accountDiscriminator: programConfigDiscriminator,
      ...this,
    });
  }

  static fromArgs(args: ProgramConfigArgs) {
    return new ProgramConfig(
      args.authority,
      args.multisigCreationFee,
      args.treasury,
      args.reserved,
    );
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link ProgramConfig} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig,
  ): Promise<ProgramConfig> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig,
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find ProgramConfig account at ${address}`);
    }
    return ProgramConfig.fromAccountInfo(accountInfo, 0)[0];
  }
}
export const programConfigBeet = new beet.BeetStruct<
  ProgramConfig,
  ProgramConfigArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["accountDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["authority", beetSolana.publicKey],
    ["multisigCreationFee", beet.u64],
    ["treasury", beetSolana.publicKey],
    ["reserved", beet.uniformFixedSizeArray(beet.u8, 64)],
  ],
  ProgramConfig.fromArgs,
  "ProgramConfig",
);

export function generateKeypair() {
  return web3.Keypair.generate();
}

const adminKeypair = web3.Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      readFileSync(path.join(__dirname, "./test-admin-keypair.json"), "utf-8"),
    ),
  ),
);

export async function airdrop(
  connection: Connection,
  to: PublicKey,
  amount?: number,
) {
  // transfer from the default account to the new account
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(adminKeypair.publicKey),
      toPubkey: to,
      lamports: amount || LAMPORTS_PER_SOL * 0.01,
    }),
  );

  tx.feePayer = adminKeypair.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.sign(adminKeypair);

  console.log(await connection.sendRawTransaction(tx.serialize()));
}

export async function generateFundedKeypair(connection: web3.Connection) {
  const keypair = web3.Keypair.generate();
  await airdrop(connection, keypair.publicKey, LAMPORTS_PER_SOL * 0.1);
  return keypair;
}

export const adminPair = () => {
  // return generateFundedKeypair(createLocalhostConnection());
  console.log("KP", process.env.KP);
  return web3.Keypair.fromSecretKey(
    utils.bytes.bs58.decode(process.env.KP || ""),
  );
};
