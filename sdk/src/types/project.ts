import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name CreateProjectArgs
 * @description
 * The arguments required to create a project.
 *
 * @property memo - The optional memo for the project.
 * @property metadata - Metadata required to create project
 *
 * @category types
 */

export type CreateProjectArgs = {
  memo: string | null;
  metadata: string;
};

/**
 * @name CreateProjectAccounts
 * @description
 * Accounts necessary for project creation, specifying the roles and keys involved in the process.
 *
 * @property creator - PublicKey of the user initiating the project creation.
 * @property createKey - A signer PublicKey used during the project creation process.
 * @property projectAccount - The PublicKey of the project's account.
 * @property treasury - The PublicKey of the treasury account associated with the project.
 * @property programConfigPda - PublicKey of the program configuration PDA.
 * @property multisig - PublicKey of a multisig account used for project management.
 * @property squadsProgram - PublicKey of the Squads program.
 * @property systemProgram - PublicKey of the System program.
 *
 * @category types
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
 * @name TransferProjectAccounts
 * @description
 * Accounts needed for the process of transferring project ownership.
 *
 * @property creator - PublicKey of the creator.
 * @property projectAccount - PublicKey of the project account.
 * @property systemProgram - PublicKey of the System program, essential for transaction execution.
 * 
 * @category types
 */

export type TransferProjectAccounts = {
  creator : web3.PublicKey;
  projectAccount: web3.PublicKey; // Project account public key
  systemProgram: web3.PublicKey; // System program ID
};

/**
 * @name TransferProjectArgs
 * @description
 * Arguments required for transferring the ownership of a project. This includes specifying the new owner's public key.
 *
 * @property newCreator - The PublicKey of the new owner to whom the project will be transferred.
 *
 * @category types
 */
export type TransferProjectArgs = {
  newCreator : web3.PublicKey;
}


/**
 * @name UpdateProjectStatusAccounts
 * @description 
 * Accounts required for updating the status of a project in the system.
 * 
 * @property creator - PublicKey of the creator.
 * @property projectAccount - PublicKey of the project account.
 * @property systemProgram - PublicKey of the System program.
 * 
 * @category types
 */

export type UpdateProjectAccounts = {
  creator : web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name ProjectUpdateArgs
 * @description
 * Arguments required for updating project details.
 *
 * @property receiver - Optional PublicKey of the receiver account.
 * @property metadata - Optional The new or updated metadata string for the project.
 *
 * @category types
 */

export type ProjectUpdateArgs = {
  receiver: web3.PublicKey | null;
  metadata: string | null;
}

/**
 * @name CloseProjectAccounts
 * @description 
 * Accounts necessary for closing a project.
 * 
 * @property creator - PublicKey of the creator.
 * @property projectAccount - PublicKey of the project account.
 * @property systemProgram - PublicKey of the System program.
 * 
 * @category types
 */

export type CloseProjectAccounts = {
  creator : web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};
