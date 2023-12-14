import { web3 } from "@coral-xyz/anchor";

/**
 * @name CreateUserArgs
 * @description
 * The arguments required to create a user.
 *
 * @property username - The user's username.
 * @property metadata - The user's ipfs metadata public key (32 bytes).
 *
 * @category types
 * @example
 * const args: CreateUserArgs = {
 *  username: "johndoe",
 *  metadata: [15, 22, 13],
 * };
 *
 */
export type CreateUserArgs = {
  username: string;
  metadata: number[];
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

/**
 * @name UpdateUserArgs
 * @description
 * The arguments required to update a user.
 *
 * @property metadata - The user's ipfs metadata public key (32 bytes).
 *
 * @category types
 * @example
 * const args: UpdateUserArgs = {
 *  metadata: [15, 22, 13],
 * };
 *
 */
export type UpdateUserArgs = {
  metadata: number[];
};

/**
 * @name UpdateUserAccounts
 * @description
 * The accounts required to update a user.
 *
 * @property authority - The user's authority.
 * @property userAccount - The user's pda.
 * @property systemProgram - The system program.
 *
 * @category types
 * @example
 * const accounts: UpdateUserAccounts = {
 *  authority: newUserKeypair.publicKey,
 *  userAccount: newUserPDA,
 *  systemProgram: anchor.web3.SystemProgram.programId,
 * };
 *
 */
export type UpdateUserAccounts = {
  authority: web3.PublicKey; // User
  userAccount: web3.PublicKey; // PDA
  systemProgram: web3.PublicKey; // System
};

/**
 * @name UpdateUserSigners
 * @description
 * The signers required to update a user.
 *
 * @category types
 * @example
 * const signers: UpdateUserSigners = [newUserKeypair];
 *
 */
export type UpdateUserSigners = web3.Keypair[];
