import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import {
  CreateContributionAccounts,
  CreateContributionArgs,
  CreateContributionSigners,
} from "../types";
import { program } from "../constants";

/**
 * @name createContribution
 * @description
 * Function to create a contribution.
 *
 * @param provider - The Anchor provider.
 * @param args - The arguments for creating a contribution.
 * @param accounts - The accounts required for the transaction.
 * @param signers - The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const createContribution = async (
  provider: anchor.AnchorProvider,
  args: CreateContributionArgs,
  accounts: CreateContributionAccounts,
  signers: CreateContributionSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createContribution(args.amount, args.split, args.createKey)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};
