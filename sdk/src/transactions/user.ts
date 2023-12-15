import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import {
  CreateUserAccounts,
  CreateUserArgs,
  CreateUserSigners,
  UpdateUserAccounts,
  UpdateUserArgs,
  UpdateUserSigners,
} from "../types";
import { program } from "../constants";

export const createUser = async (
  provider: anchor.AnchorProvider,
  args: CreateUserArgs,
  accounts: CreateUserAccounts,
  signers: CreateUserSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createUser(args.username, args.metadata)
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

export const updateUser = async (
  provider: anchor.AnchorProvider,
  args: UpdateUserArgs,
  accounts: UpdateUserAccounts,
  signers: UpdateUserSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .updateUser(args.metadata)
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
