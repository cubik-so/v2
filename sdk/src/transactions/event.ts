import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import {
  CreateEventAccounts,
  CreateEventArgs,
  CreateEventSigners,
  CreateEventJoinAccounts,
  CreateEventJoinArgs,
  CreateEventJoinSigners,
  UpdateEventStatusAccounts,
  UpdateEventStatusArgs,
  UpdateEventStatusSigners,
  UpdateEventAccounts,
  UpdateEventArgs,
  UpdateEventSigners,
  InviteEventJoinAccounts,
  InviteEventJoinSigners,
  EventProjectStatus,
} from "../types";
import { program } from "../constants";

export const createEvent = async (
  provider: anchor.AnchorProvider,
  args: CreateEventArgs,
  accounts: CreateEventAccounts,
  signers: CreateEventSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createEvent(args.matchingPool, args.metadata)
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

export const createEventJoin = async (
  provider: anchor.AnchorProvider,
  args: CreateEventJoinArgs,
  accounts: CreateEventJoinAccounts,
  signers: CreateEventJoinSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createEventJoin(args.counter, args.eventKey)
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

const statusArg = [
  {
    name: "status",
    type: {
      defined: EventProjectStatus.Approved, // Or any other value from EventProjectStatus
    },
  },
];

export const updateEventJoinStatus = async (
  provider: anchor.AnchorProvider,
  args: UpdateEventStatusArgs,
  accounts: UpdateEventStatusAccounts,
  signers: UpdateEventStatusSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .updateEventJoinStatus(statusArg) // @todo: fix this enum shit
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

export const updateEvent = async (
  provider: anchor.AnchorProvider,
  args: UpdateEventArgs,
  accounts: UpdateEventAccounts,
  signers: UpdateEventSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .updateEvent(args.matchingPool, args.metadata)
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

export const inviteEventJoin = async (
  provider: anchor.AnchorProvider,
  accounts: InviteEventJoinAccounts,
  signers: InviteEventJoinSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .inviteEventJoin()
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
