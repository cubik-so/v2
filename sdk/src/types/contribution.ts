import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name ContributionSolArgs
 * @description
 * The arguments required to create a sol contribution.
 *
 */
export type ContributionSolArgs = {
  amount: BN;
  split: BN;
};

/**
 * @name ContributionSolAccounts
 * @description
 * The accounts required for creating a sol contribution.
 *
 *
 */
export type ContributionSolAccounts = {
  authority: web3.PublicKey;
  receiver: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
  userAccount: web3.PublicKey;
};

/**
 * @name ContributionSplArgs
 * @description
 * The arguments required to create a spl contribution.
 *
 */
export type ContributionSplArgs = {
  amount: BN;
  split: BN;
};

/**
 * @name ContributionSplAccounts
 * @description
 * The accounts required for creating a spl contribution.
 *
 */
export type ContributionSplAccounts = {
  authority: web3.PublicKey;
  tokenMint: web3.PublicKey;
  tokenAtaSender: web3.PublicKey;
  tokenAtaReceiver: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
  userAccount: web3.PublicKey;
};
