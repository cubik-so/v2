import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import { CreateAdminAccounts, CreateAdminSigners } from "../types";
import { program } from "../constants";

// Function to create an admin
export const createAdmin = async (
  provider: anchor.AnchorProvider,
  accounts: CreateAdminAccounts,
  signers: CreateAdminSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .createAdmin()
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
