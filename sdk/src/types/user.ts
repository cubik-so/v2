import { web3 } from "@coral-xyz/anchor";

/**
 * @name CreateUserArgs
 * @description
 * The arguments required to create a user.
 *
 * @property username - The user's username.
 *
 * @category types
 * @example
 * const args: CreateUserArgs = {
 *  username: "johndoe",
 * };
 *
 */
export type CreateUserArgs = {
  username: string;
};

/**
 * @name CreateUserAccounts
 * @description
 * The accounts required to create a user.
 *
 * @property authority - The user's authority.
 * @property userAccount - The user's pda.
 * @property systemProgram - The system program.
 *
 * @category types
 * @example
 * const accounts: CreateUserAccounts = {
 *  authority: newUserKeypair.publicKey,
 *  userAccount: newUserPDA,
 *  systemProgram: anchor.web3.SystemProgram.programId,
 * };
 *
 */
export type CreateUserAccounts = {
  authority: web3.PublicKey; // User
  userAccount: web3.PublicKey; // PDA
  systemProgram: web3.PublicKey; // System
};

/**
 * @name CreateUserSigners
 * @description
 * The signers required to create a user.
 *
 * @category types
 * @example
 * const signers: CreateUserSigners = [newUserKeypair];
 *
 */
export type CreateUserSigners = web3.Keypair[];
