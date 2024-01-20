import { BN, web3 } from "@coral-xyz/anchor";

export type DonationSOLArgs = {
  amount: BN;
};

export type DonationSOLAccounts = {
  authority: web3.PublicKey;
  userAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  receiver: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type DonationSPLArgs = {
  amount: BN;
};

export type DonationSPLAccounts = {
  authority: web3.PublicKey;
  userAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  tokenMint: web3.PublicKey;
  tokenAtaSender: web3.PublicKey;
  tokenAtaReceiver: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};
