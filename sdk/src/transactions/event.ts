import * as anchor from "@coral-xyz/anchor";
import {
  CreateEventHandlerArgs,
  CreateEventAccounts,
  CreateEventSigners,
  CreateEventJoinHandlerArgs,
  CreateEventJoinAccounts,
  CreateEventJoinSigners,
  UpdateEventStatusArgs,
  UpdateEventStatusAccounts,
  UpdateEventStatusSigners,
  UpdateEventArgs,
  UpdateEventAccounts,
  UpdateEventSigners,
  InviteEventJoinAccounts,
  InviteEventJoinSigners,
} from "../types";

import { program } from "../constants";

/**
 * Create an event.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const createEvent = async (
  provider: anchor.AnchorProvider,
  args: CreateEventHandlerArgs,
  accounts: CreateEventAccounts,
  signers: CreateEventSigners,
): Promise<anchor.web3.Transaction> => {
  const ix = await program.methods
    .createEvent(args.matchingPool)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new anchor.web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};

/**
 * Create an event join.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const createEventJoin = async (
  provider: anchor.AnchorProvider,
  args: CreateEventJoinHandlerArgs,
  accounts: CreateEventJoinAccounts,
  signers: CreateEventJoinSigners,
): Promise<anchor.web3.Transaction> => {
  const ix = await program.methods
    .createEventJoin(args.counter, args.eventKey)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new anchor.web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};

/**
 * Update an event's status.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
// export const updateEventStatus = async (
//   provider: anchor.AnchorProvider,
//   args: UpdateEventStatusArgs,
//   accounts: UpdateEventStatusAccounts,
//   signers: UpdateEventStatusSigners,
// ): Promise<anchor.web3.Transaction> => {
//   const ix = await program.methods
//     .updateEventStatus(args.status)
//     .accounts(accounts)
//     .signers(signers)
//     .instruction();

//   const tx = new anchor.web3.Transaction().add(ix);
//   tx.recentBlockhash = (
//     await provider.connection.getLatestBlockhash()
//   ).blockhash;
//   tx.feePayer = accounts.authority;

//   return tx;
// };

/**
 * Update an event.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const updateEvent = async (
  provider: anchor.AnchorProvider,
  args: UpdateEventArgs,
  accounts: UpdateEventAccounts,
  signers: UpdateEventSigners,
): Promise<anchor.web3.Transaction> => {
  const ix = await program.methods
    .updateEvent(args.matchingPool)
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new anchor.web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};

/**
 * Invite to join an event.
 * @param provider The Anchor provider.
 * @param args The arguments for the function (placeholder, as there are no specific arguments).
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const inviteEventJoin = async (
  provider: anchor.AnchorProvider,
  accounts: InviteEventJoinAccounts,
  signers: InviteEventJoinSigners,
): Promise<anchor.web3.Transaction> => {
  const ix = await program.methods
    .inviteEventJoin()
    .accounts(accounts)
    .signers(signers)
    .instruction();

  const tx = new anchor.web3.Transaction().add(ix);
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.feePayer = accounts.authority;

  return tx;
};
