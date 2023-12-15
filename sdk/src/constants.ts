import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import { Cubik } from "./types";

/**
 * Program address
 *
 * @category constants
 */
export const PROGRAM_ADDRESS = "3s9zZaosL6hJFeDToXDoPN4sQgyVwLEdqzaztZXj1Nnk";

/**
 * Program IDL
 *
 * @category constants
 */
import IDL from "../../target/idl/cubik.json";
export const idl = IDL;

/**
 * Cubik Program Public Key
 *
 * @category constants
 */
export const PROGRAM_ID = new web3.PublicKey(PROGRAM_ADDRESS);

/**
 * Cubik Program
 *
 * @category constants
 */
export const program = anchor.workspace.Cubik as anchor.Program<Cubik>;
