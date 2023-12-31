import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import {
  CreateSubAdminHandlerArgs,
  CreateSubAdminContext,
  CloseSubAdminContext,
} from "../types";
import { program } from "../constants";

/**
 * Create a sub-admin.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const createSubAdminHandler = async (
  provider: anchor.AnchorProvider,
  args: CreateSubAdminHandlerArgs,
  accounts: CreateSubAdminContext,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createSubAdmin(args.status, args.newSubAdminAuthority)
    .accounts(accounts)
    .instruction();

  const tx = new web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};

/**
 * Close a sub-admin account.
 * @param provider The Anchor provider.
 * @param accounts The accounts required for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const closeSubAdminHandler = async (
  provider: anchor.AnchorProvider,
  accounts: CloseSubAdminContext,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .closeSubAdmin()
    .accounts(accounts)
    .instruction();

  const tx = new web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};
