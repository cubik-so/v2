import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
  InitSponsorAccounts,
  InitSponsorArgs,
  InitSponsorSigners,
} from "../types";
import { program } from "../constants";

export const initSponsor = async (
  provider: anchor.AnchorProvider,
  args: InitSponsorArgs,
  accounts: InitSponsorAccounts,
  signers: InitSponsorSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .initSponsor(args.vault, args.totalCommitted, args.metadata) // @todo: pending in contract lib
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
