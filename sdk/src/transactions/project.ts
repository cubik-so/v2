import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import {
  CreateProjectAccounts,
  CreateProjectArgs,
  CreateProjectSigners,
  UpdateProjectAccounts,
  UpdateProjectArgs,
  UpdateProjectSigners,
  TransferProjectAccounts,
  TransferProjectSigners,
} from "../types";
import { program } from "../constants";

/**
 *
 * @name createProject
 * @description
 * Creates a project.
 *
 * @param provider anchor.AnchorProvider
 * @param args CreateProjectArgs
 * @param accounts CreateProjectAccounts
 * @param signers CreateProjectSigners
 * @returns Promise<web3.Transaction>
 *
 * @category transactions
 */
export const createProject = async (
  provider: anchor.AnchorProvider,
  args: CreateProjectArgs,
  accounts: CreateProjectAccounts,
  signers: CreateProjectSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createProject(args.counter, args.squadsProgramID, args.metadata)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.owner;

  return tx;
};

/**
 *
 * @name updateProject
 * @description
 * Updates a project.
 *
 * @param provider anchor.AnchorProvider
 * @param args UpdateProjectArgs
 * @param accounts UpdateProjectAccounts
 * @param signers UpdateProjectSigners
 * @returns Promise<web3.Transaction>
 *
 * @category transactions
 */
export const updateProject = async (
  provider: anchor.AnchorProvider,
  args: UpdateProjectArgs,
  accounts: UpdateProjectAccounts,
  signers: UpdateProjectSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .updateProject(args.metadata)
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

/**
 * @name transferProject
 * @description
 * Transfers a project to new user.
 *
 * @param provider anchor.AnchorProvider
 * @param accounts TransferProjectAccounts
 * @param signers TransferProjectSigners
 * @returns Promise<web3.Transaction>
 *
 * @category transactions
 */
export const transferProject = async (
  provider: anchor.AnchorProvider,
  accounts: TransferProjectAccounts,
  signers: TransferProjectSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .transferProject()
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
