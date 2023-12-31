import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name CreateProjectArgs
 * @description
 * The arguments required to create a project.
 *
 * @property counter - The project's counter.
 * @property membersKeys - The public keys of the members.
 * @property threshold - The threshold for multisig.
 * @property configAuthority - The optional public key of the config authority.
 * @property timeLock - The time lock in seconds.
 * @property memo - The optional memo for the project.
 *
 * @category types
 * @example
 * const args: CreateProjectArgs = {
 *  counter: new BN(0),
 *  membersKeys: [member1, member2, member3],
 *  threshold: 2,
 *  configAuthority: null,
 *  timeLock: 0,
 *  memo: null,
 * };
 *
 */
export type CreateProjectArgs = {
  counter: BN;
  membersKeys: web3.PublicKey[];
  threshold: number;
  configAuthority: web3.PublicKey | null;
  timeLock: number;
  memo: string | null;
};

/**
 * @name CreateProjectAccounts
 * @description
 * The accounts required to create a project.
 *
 * @property owner - The public key of the owner who is creating the project.
 * @property createKey - A signer key used in the creation of the project.
 * @property projectAccount - The public key of the project account.
 * @property userAccount - The public key of the user account associated with the project.
 * @property multisig - The public key of the multisig account (UncheckedAccount).
 * @property squadsProgram - The public key of the squads program.
 * @property systemProgram - The public key of the system program.
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
 * const signers: CreateProjectSigners = [owner, createKey];
 *
 */
export type CreateProjectSigners = web3.Keypair[];

/**
 * @name ProjectVerification
 * @description Enum representing the various states of project verification.
 */
export enum ProjectVerification {
  // Replace these with the actual states from your Rust enum
  Unverified,
  UnderReview,
  Verified,
  // Add other states as necessary
}

/**
 * @name ProjectStatusHandlerArgs
 * @description The arguments required to update a project's status.
 * @property status - The new status of the project, represented by the ProjectVerification enum.
 */
export type ProjectStatusHandlerArgs = {
  status: any; // Enum representing project verification statuses
};

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

/**
 * @name UpdateProjectStatusAccounts
 * @description The accounts required for updating the status of a project.
 * @property authority - The public key of the authority executing the action.
 * @property subAdminAccount - The public key of the sub-admin account.
 * @property projectAccount - The public key of the project account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type UpdateProjectStatusAccounts = {
  authority: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name UpdateProjectStatusSigners
 * @description The signers required for updating the status of a project.
 */
export type UpdateProjectStatusSigners = web3.Keypair[];

/**
 * @name CloseProjectAccounts
 * @description The accounts required for closing a project.
 * @property authority - The public key of the authority executing the closure.
 * @property projectAccount - The public key of the project account being closed.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type CloseProjectAccounts = {
  authority: web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name CloseProjectSigners
 * @description The signers required to close a project.
 */
export type CloseProjectSigners = web3.Keypair[];
