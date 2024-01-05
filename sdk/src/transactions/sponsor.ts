import * as anchor from '@coral-xyz/anchor';
import { web3 } from '@coral-xyz/anchor';
import {
  InitSponsorArgs,
  InitSponsorAccounts,
  InitSponsorSigners,
  UpdateSponsorArgs,
  UpdateSponsorAccounts,
  UpdateSponsorSigners,
  AddMemberSponsorArgs,
  SponsorTeamAccounts,
  SponsorTeamSigners,
} from '../types';
import { createCubikProgram } from '../constants';

/**
 * Initialize a sponsor.
 * @param programId The programId.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const initSponsorHandler = async (
  programId: string,
  args: InitSponsorArgs,
  accounts: InitSponsorAccounts,
  signers: InitSponsorSigners
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .initSponsor(args.vault, args.totalCommitted)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};

/**
 * Update a sponsor.
 * @param programId The programId.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const updateSponsor = async (
  programId: string,
  args: UpdateSponsorArgs,
  accounts: UpdateSponsorAccounts,
  signers: UpdateSponsorSigners
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .updateSponsor(args.totalCommitted)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};

/**
 * Add a member to a sponsor team.
 * @param programId The programId.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const addMemberSponsor = async (
  programId: string,
  args: AddMemberSponsorArgs,
  accounts: SponsorTeamAccounts,
  signers: SponsorTeamSigners
): Promise<web3.Transaction> => {
  const program = createCubikProgram(programId);
  const ix = await program.methods
    .addMemberSponsor(args.teamMemberKey)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);

  return tx;
};
