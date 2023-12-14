import { BN, web3 } from "@coral-xyz/anchor";

export type InitSponsorArgs = {
  vault: web3.PublicKey;
  totalCommitted: BN;
  metadata: string;
};

export type InitSponsorAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type InitSponsorSigners = web3.Keypair[];

export type AddMemberSponsorArgs = {
  teamMemberKey: web3.PublicKey;
};

export type AddMemberSponsorAccounts = {
  authority: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type AddMemberSponsorSigners = web3.Keypair[];

export type UpdateSponsorArgs = {
  metadata: string;
  totalCommitted: BN;
};

export type UpdateSponsorAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type UpdateSponsorSigners = web3.Keypair[];

export type FundSponsorVaultSplArgs = {
  amount: BN;
  amountUsd: BN;
};

export type FundSponsorVaultSplAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  tokenMint: web3.PublicKey;
  tokenAtaSender: web3.PublicKey;
  tokenAtaReceiver: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type FundSponsorVaultSplSigners = web3.Keypair[];

export type FundSponsorVaultSolArgs = {
  amount: BN;
  amountUsd: BN;
};

export type FundSponsorVaultSolAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  receiverAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type FundSponsorVaultSolSigners = web3.Keypair[];
