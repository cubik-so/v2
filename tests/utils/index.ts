import dotenv from "dotenv";
import * as anchor from "@coral-xyz/anchor";
import { Cubik } from "../../target/types/cubik";
import path from "path";
import fs from "fs";

dotenv.config();

export const userKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array());

export const adminKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array());

export const subAdminKeypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(),
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
