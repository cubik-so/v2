import { web3 } from '@coral-xyz/anchor';
import {
  CreateSubAdminHandlerArgs,
  CreateSubAdminContext,
  CloseSubAdminContext,
} from '../types';
import { createCubikProgram } from '../constants';

/**
 * Create a sub-admin.
 * @param programId The program ID.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const createSubAdminHandler = async (
  programId: string,
  args: CreateSubAdminHandlerArgs,
  accounts: CreateSubAdminContext
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .createSubAdmin(args.status, args.newSubAdminAuthority)
    .accounts(accounts)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};

/**
 * Close a sub-admin account.
 * @param programId The program ID.
 * @param accounts The accounts required for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const closeSubAdminHandler = async (
  programId: string,
  accounts: CloseSubAdminContext
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .closeSubAdmin()
    .accounts(accounts)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};
