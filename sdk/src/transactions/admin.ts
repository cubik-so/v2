import { web3 } from '@coral-xyz/anchor';
import { CreateAdminAccounts, CreateAdminSigners } from '../types';
import { createCubikProgram } from '../constants';

// Function to create an admin
export const createAdmin = async (
  programId: string,
  accounts: CreateAdminAccounts,
  signers: CreateAdminSigners
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .createAdmin()
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};
