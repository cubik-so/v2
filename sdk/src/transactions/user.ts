import { web3 } from '@coral-xyz/anchor';
import {
  CreateUserAccounts,
  CreateUserArgs,
  CreateUserSigners,
} from '../types';
import { createCubikProgram } from '../constants';

export const createUser = async (
  programId: string,
  args: CreateUserArgs,
  accounts: CreateUserAccounts,
  signers: CreateUserSigners
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .createUser(args.username)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};
