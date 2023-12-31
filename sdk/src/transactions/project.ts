import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import {
  CreateProjectAccounts,
  CreateProjectArgs,
  CreateProjectSigners,
  TransferProjectAccounts,
  TransferProjectSigners,
  ProjectStatusHandlerArgs,
  UpdateProjectStatusAccounts,
  UpdateProjectStatusSigners,
  CloseProjectSigners,
  CloseProjectAccounts,
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
    .createProject(
      args.counter,
      args.membersKeys,
      args.threshold,
      args.configAuthority,
      args.timeLock,
      args.memo,
    )
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

/**
 * Update the status of a project.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const updateProjectStatus = async (
  provider: anchor.AnchorProvider,
  args: ProjectStatusHandlerArgs,
  accounts: UpdateProjectStatusAccounts,
  signers: UpdateProjectStatusSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .updateProjectStatus(args.status) // @todo: enum issue
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
 * Close a project.
 * @param provider The Anchor provider.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
// export const closeProject = async (
//   provider: anchor.AnchorProvider,
//   accounts: CloseProjectAccounts,
//   signers: CloseProjectSigners,
// ): Promise<web3.Transaction> => {
//   const ix = await program.methods
//     .closeProject()
//     .accounts(accounts)
//     .signers(signers)
//     .instruction();

//   const tx = new web3.Transaction().add(ix);
//   tx.recentBlockhash = (
//     await provider.connection.getLatestBlockhash()
//   ).blockhash;
//   tx.feePayer = accounts.authority;

//   return tx;
// };
