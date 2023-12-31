import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
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
  FundSponsorVaultSPLArgs,
  FundSponsorVaultSPLAccounts,
  FundSponsorVaultSPLSigners,
  FundSponsorVaultSOLArgs,
  FundSponsorVaultSOLAccounts,
  FundSponsorVaultSOLSigners,
} from "../types";
import { program } from "../constants";

/**
 * Initialize a sponsor.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const initSponsorHandler = async (
  provider: anchor.AnchorProvider,
  args: InitSponsorArgs,
  accounts: InitSponsorAccounts,
  signers: InitSponsorSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .initSponsor(args.vault, args.totalCommitted)
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
 * Update a sponsor.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const updateSponsor = async (
  provider: anchor.AnchorProvider,
  args: UpdateSponsorArgs,
  accounts: UpdateSponsorAccounts,
  signers: UpdateSponsorSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .updateSponsor(args.totalCommitted)
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
 * Add a member to a sponsor team.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const addMemberSponsor = async (
  provider: anchor.AnchorProvider,
  args: AddMemberSponsorArgs,
  accounts: SponsorTeamAccounts,
  signers: SponsorTeamSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .addMemberSponsor(args.teamMemberKey)
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
 * Fund a sponsor's SPL token vault.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const fundSponsorVaultSPL = async (
  provider: anchor.AnchorProvider,
  args: FundSponsorVaultSPLArgs,
  accounts: FundSponsorVaultSPLAccounts,
  signers: FundSponsorVaultSPLSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .fundSponsorVaultSpl(args.amount, args.amountUsd)
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
 * Fund a sponsor's SOL vault.
 * @param provider The Anchor provider.
 * @param args The arguments for the function.
 * @param accounts The accounts required for the transaction.
 * @param signers The signers for the transaction.
 * @returns A promise that resolves to a Solana transaction.
 */
export const fundSponsorVaultSOL = async (
  provider: anchor.AnchorProvider,
  args: FundSponsorVaultSOLArgs,
  accounts: FundSponsorVaultSOLAccounts,
  signers: FundSponsorVaultSOLSigners,
): Promise<web3.Transaction> => {
  const ix = await program.methods
    .fundSponsorVaultSol(args.amount, args.amountUsd)
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
