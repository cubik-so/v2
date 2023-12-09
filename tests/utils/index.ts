import dotenv from "dotenv";
import * as anchor from "@coral-xyz/anchor";
import { Cubik } from "../../target/types/cubik";
import path from "path";
import fs, { readFileSync } from "fs";
import { Keypair } from "@solana/web3.js";

dotenv.config();

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const userKeypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from([
    70, 75, 234, 200, 10, 105, 89, 53, 122, 215, 85, 31, 73, 103, 151, 120, 16,
    153, 209, 40, 45, 182, 2, 250, 21, 33, 246, 243, 140, 18, 110, 179, 13, 139,
    177, 253, 168, 189, 17, 121, 30, 129, 124, 235, 64, 59, 15, 13, 241, 47, 92,
    56, 56, 2, 25, 24, 84, 195, 228, 89, 65, 248, 200, 13,
  ]),
);

export const adminKeypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from([
    204, 14, 50, 60, 146, 116, 241, 54, 158, 195, 160, 166, 75, 127, 235, 78,
    244, 77, 151, 216, 43, 25, 96, 126, 87, 160, 99, 163, 136, 66, 60, 95, 136,
    227, 200, 175, 13, 18, 143, 65, 79, 193, 131, 172, 54, 228, 93, 60, 225,
    213, 53, 210, 209, 97, 145, 194, 76, 244, 145, 166, 26, 18, 7, 243,
  ]),
);

export const subAdminKeypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from([
    243, 61, 97, 67, 197, 218, 95, 246, 129, 67, 228, 132, 96, 218, 134, 90, 81,
    0, 102, 114, 190, 172, 127, 49, 183, 103, 21, 137, 61, 53, 80, 248, 6, 134,
    62, 217, 157, 97, 33, 200, 209, 37, 242, 52, 146, 9, 83, 81, 39, 247, 193,
    233, 81, 90, 89, 136, 8, 220, 223, 183, 163, 179, 71, 210,
  ]),
);

const cubikKeypair = anchor.web3.Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      readFileSync(
        path.join(__dirname, "..", "..", "/wallets/cubik-keypair.json"),
        "utf-8",
      ),
    ),
  ),
);

export const squadsProgramId = new anchor.web3.PublicKey(
  "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf",
);

export const program = anchor.workspace.Cubik as anchor.Program<Cubik>;

export const [adminPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
  [anchor.utils.bytes.utf8.encode("admin")],
  program.programId,
);

export const [subAdminPDA, __] = anchor.web3.PublicKey.findProgramAddressSync(
  [
    anchor.utils.bytes.utf8.encode("admin"),
    subAdminKeypair.publicKey.toBuffer(),
  ],
  program.programId,
);

export const [userPDA, ____] = anchor.web3.PublicKey.findProgramAddressSync(
  [anchor.utils.bytes.utf8.encode("user"), userKeypair.publicKey.toBuffer()],
  program.programId,
);

export const getProvider = (keypair: Keypair) => {
  anchor.setProvider(
    new anchor.AnchorProvider(
      new anchor.web3.Connection(
        "https://devnet.helius-rpc.com/?api-key=d17f1226-b554-443e-978e-b41d01825ea4",
      ),
      new anchor.Wallet(keypair),
      {
        commitment: "confirmed",
      },
    ),
  );
  return anchor.getProvider();
};

export const airdrop = async (keypair: Keypair) => {
  const cubikWallet = new anchor.Wallet(cubikKeypair);
  const tx = new anchor.web3.Transaction();

  tx.add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: cubikWallet.publicKey,
      toPubkey: keypair.publicKey,
      lamports: anchor.web3.LAMPORTS_PER_SOL / 4,
    }),
  );

  await getProvider(cubikKeypair).sendAndConfirm(tx);
};
