import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name CreateContributionArgs
 * @description
 * The arguments required to create a contribution.
 *
 * @property amount - The amount of the contribution.
 * @property split - The split of the contribution.
 * @property createKey - The public key used to create the contribution.
 *
 * @category types
 * @example
 * const args: CreateContributionArgs = {
 *  amount: new BN(100),
 *  split: new BN(50),
 *  createKey: new web3.PublicKey("..."),
 * };
 */
export type CreateContributionArgs = {
  amount: BN;
  split: BN;
  createKey: web3.PublicKey;
};

/**
 * @name CreateContributionAccounts
 * @description
 * The accounts required for creating a contribution.
 *
 * @property authority - The authority executing the transaction.
 * @property tokenMint - The token mint account.
 * @property tokenAtaSender - The token account of the sender.
 * @property tokenAtaReceiver - The token account of the receiver.
 * @property projectAccount - The project account.
 * @property eventAccount - The event account.
 * @property eventJoinAccount - The event join account.
 * @property systemProgram - The system program.
 * @property tokenProgram - The token program.
 * @property rent - The rent sysvar.
 *
 * @category types
 * @example
 * const accounts: CreateContributionAccounts = {
 *  authority: userKeypair.publicKey,
 *  tokenMint: mintPublicKey,
 *  tokenAtaSender: senderTokenAccount,
 *  tokenAtaReceiver: receiverTokenAccount,
 *  projectAccount: projectAccountPublicKey,
 *  eventAccount: eventAccountPublicKey,
 *  eventJoinAccount: eventJoinAccountPublicKey,
 *  systemProgram: anchor.web3.SystemProgram.programId,
 *  tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
 *  rent: anchor.utils.sysvar.RENT_PROGRAM_ID,
 * };
 */
export type CreateContributionAccounts = {
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
};
