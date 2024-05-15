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
  memo: string | null;
  metadata: string;
};

/**
 * @name CreateProjectAccounts
 * @description
 * The accounts required to create a project.
 *
 * @property owner - The public key of the owner who is creating the project.
 * @property createKey - A signer key used in the creation of the project.
 * @property projectAccount - The public key of the project account.
 * @property treasury - The public key of the treasury.
 * @property programConfigPda - The public key of the programConfigPda.
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
  creator: web3.PublicKey; // User who is creating the project
  createKey: web3.PublicKey; // random keypair
  projectAccount: web3.PublicKey; // Project PDA
  treasury: web3.PublicKey;
  programConfigPda: web3.PublicKey;
  multisig: web3.PublicKey; // Multisig PDA
  squadsProgram: web3.PublicKey; // Squads program id
  systemProgram: web3.PublicKey; // System program id
};

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
  creator : web3.PublicKey;
  projectAccount: web3.PublicKey; // Project account public key
  systemProgram: web3.PublicKey; // System program ID
};

export type TransferProjectArgs = {
  newCreator : web3.PublicKey;
}
/**
 * @name UpdateProjectStatusAccounts
 * @description The accounts required for updating the status of a project.
 * @property authority - The public key of the authority executing the action.
 * @property subAdminAccount - The public key of the sub-admin account.
 * @property projectAccount - The public key of the project account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type UpdateProjectAccounts = {
  creator : web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

export type ProjectUpdateArgs = {
  receiver: web3.PublicKey | null;
  metadata: string | null;
}

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
