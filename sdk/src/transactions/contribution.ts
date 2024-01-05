import { web3 } from '@coral-xyz/anchor';
import {
  CreateContributionAccounts,
  CreateContributionArgs,
  CreateContributionSigners,
} from '../types';
import { createCubikProgram } from '../constants';

/**
 * @name createContribution
 * @description
 * Function to create a contribution.
 * @param programId - The programId.
 * @param args - The arguments for creating a contribution.
 * @param accounts - The accounts required for the transaction.
 * @param signers - The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const createContribution = async (
  programId: string,
  args: CreateContributionArgs,
  accounts: CreateContributionAccounts,
  signers: CreateContributionSigners
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .createContribution(args.amount, args.split, args.createKey)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};
