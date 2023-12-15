import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name CreateProjectArgs
 * @description
 * The arguments required to create a project.
 *
 * @property counter - The project's counter.
 * @property squadsProgramID - The squads program id.
 * @property metadata - The project's ipfs metadata public key (32 bytes).
 *
 * @category types
 * @example
 * const args: CreateProjectArgs = {
 *  counter: new BN(0),
 *  squadsProgramID: new PublicKey("sqds..."),
 *  metadata: [15, 22, 13],
 * };
 *
 */
export type CreateProjectArgs = {
  counter: BN;
  squadsProgramID: web3.PublicKey;
  metadata: number[];
};

/**
 * @name CreateProjectAccounts
 * @description
 * The accounts required to create a project.
 *
 * @property owner - The user who is creating the project.
 * @property createKey - The random keypair.
 * @property projectAccount - The project PDA.
 * @property userAccount - The user PDA.
 * @property multisig - The multisig PDA.
 * @property squadsProgram - The squads program id.
 * @property systemProgram - The system program id.
 *
 * @category types
 * @example
 * const accounts: CreateProjectAccounts = {
 *  owner: userKeypair.publicKey,
 *  createKey: createKey.publicKey,
 *  projectAccount: projectPDA,
 *  userAccount: userPDA,
 *  multisig: multisig.publicKey,
 *  squadsProgram: squadsProgramId,
 *  systemProgram: anchor.web3.SystemProgram.programId,
 * };
 *
 */
export type CreateProjectAccounts = {
  owner: web3.PublicKey; // User who is creating the project
  createKey: web3.PublicKey; // random keypair
  projectAccount: web3.PublicKey; // Project PDA
  userAccount: web3.PublicKey; // User PDA
  multisig: web3.PublicKey; // Multisig PDA
  squadsProgram: web3.PublicKey; // Squads program id
  systemProgram: web3.PublicKey; // System program id
};

/**
 * @name CreateProjectSigners
 * @description
 * The signers required to create a project.
 *
 * @category types
 * @example
 * const signers: CreateProjectSigners = [userKeypair, createKey];
 *
 */
export type CreateProjectSigners = web3.Keypair[];

/**
 * @name UpdateProjectArgs
 * @description
 * The arguments required to update a project's metadata.
 *
 * @property metadata - The new project's ipfs metadata public key (32 bytes).
 *
 * @category types
 * @example
 * const args: UpdateProjectArgs = {
 *  metadata: [15, 22, 13, ...],
 * };
 *
 */
export type UpdateProjectArgs = {
  metadata: number[];
};

/**
 * @name UpdateProjectAccounts
 * @description
 * The accounts required to update a project.
 *
 * @property authority - The authority of the project (typically the user).
 * @property projectAccount - The public key of the project account.
 * @property systemProgram - The system program id.
 *
 * @category types
 * @example
 * const accounts: UpdateProjectAccounts = {
 *  authority: userKeypair.publicKey,
 *  projectAccount: projectPDA,
 *  systemProgram: anchor.web3.SystemProgram.programId,
 * };
 *
 */
export type UpdateProjectAccounts = {
  authority: web3.PublicKey; // Authority of the project
  projectAccount: web3.PublicKey; // Project account public key
  systemProgram: web3.PublicKey; // System program ID
};

/**
 * @name UpdateProjectSigners
 * @description
 * The signers required to update a project.
 *
 * @category types
 * @example
 * const signers: UpdateProjectSigners = [userKeypair];
 *
 */
export type UpdateProjectSigners = web3.Keypair[];

/**
 * @name TransferProjectArgs
 * @description
 * The arguments required to transfer a project to a new owner.
 * This function may not require explicit arguments in the instruction call.
 *
 * @category types
 * @example
 * // Typically, no arguments are passed to a transfer function
 * const args: TransferProjectArgs = {};
 *
 */
export type TransferProjectArgs = {};

/**
 * @name TransferProjectAccounts
 * @description
 * The accounts required to transfer a project.
 *
 * @property authority - The current authority (owner) of the project.
 * @property projectAccount - The public key of the project account.
 * @property transferUserAccount - The new owner's user account.
 * @property systemProgram - The system program id.
 *
 * @category types
 * @example
 * const accounts: TransferProjectAccounts = {
 *  authority: userKeypair.publicKey,
 *  projectAccount: projectPDA,
 *  transferUserAccount: newOwner,
 *  systemProgram: anchor.web3.SystemProgram.programId,
 * };
 *
 */
export type TransferProjectAccounts = {
  authority: web3.PublicKey; // Current authority (owner) of the project
  projectAccount: web3.PublicKey; // Project account public key
  transferUserAccount: web3.PublicKey; // New owner's user account
  systemProgram: web3.PublicKey; // System program ID
};

/**
 * @name TransferProjectSigners
 * @description
 * The signers required to transfer a project.
 *
 * @category types
 * @example
 * const signers: TransferProjectSigners = [userKeypair];
 *
 */
export type TransferProjectSigners = web3.Keypair[];
