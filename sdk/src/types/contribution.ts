import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name ContributionSolArgs
 * @description Arguments required to create a SOL contribution, specifying the amount to be contributed.
 * @property amount - The amount of SOL to contribute.
 */
export type ContributionSolArgs = {
  amount: BN;
};

/**
 * @name ContributionSolAccounts
 * @description
 * The accounts required for creating a sol contribution.
 * @property authority - The public key of authority.
 * @property receiver - The public key of receiver.
 * @property projectAccount - The public key of projectAccount.
 * @property eventAccount - The public key of the eventAccount.
 * @property eventParticipantAccount - The public key of the eventParticipantAccount.
 * @property systemProgram - The public key of the systemProgram.
 * 
 */
export type ContributionSolAccounts = {
  authority: web3.PublicKey;
  receiver: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventParticipantAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name ContributionSplArgs
 * @description
 * The arguments required to create a spl contribution.
 * @property amount - The amount of SPL tokens to contribute.
 *
 */
export type ContributionSplArgs = {
  amount: BN;
};

/**
 * @name ContributionSplAccounts
 * @description
 * The accounts required for creating a spl contribution.
 * @property authority - The public key of the authority.
 * @property tokenMint - The public key of the SPL tokenMint.
 * @property tokenAtaSender - The public key of tokenAtaSender.
 * @property tokenAtaReceiver - The public key of tokenAtaReceiver.
 * @property projectAccount - The public key of the project account.
 * @property eventAccount - The public key of the event account.
 * @property eventParticipantAccount - The public key of the event participant account.
 * @property systemProgram - Reference to the Solana system program, used for transactions.
 * @property tokenProgram - Reference to the Solana token program, used for SPL token transactions.
 * 
 */
export type ContributionSplAccounts = {
  authority: web3.PublicKey;
  tokenMint: web3.PublicKey;
  tokenAtaSender: web3.PublicKey;
  tokenAtaReceiver: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventParticipantAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
};
