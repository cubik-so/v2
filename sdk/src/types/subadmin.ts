import { web3 } from '@coral-xyz/anchor';

/**
 * @name SubAdminPermission
 * @description Enum representing the various permissions for a sub-admin.
 */
export enum SubAdminPermission {
  // Adjust these based on your Rust enum
  None,
  GOD,
  Manager,
  // Add other permissions as necessary
}

/**
 * @name CreateSubAdminHandlerArgs
 * @description The arguments required to create a sub-admin.
 * @property status - The status of the sub-admin.
 * @property newSubAdminAuthority - The public key of the new sub-admin authority.
 */
export type CreateSubAdminHandlerArgs = {
  level: any;
  newSubAdminAuthority: web3.PublicKey;
};

/**
 * @name CreateSubAdminContext
 * @description The accounts required for creating a sub-admin.
 * @property authority - The public key of the authority.
 * @property createKey - The public key used for creation.
 * @property adminAccount - The public key of the admin account.
 * @property subAdminAccount - The public key of the existing sub-admin account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type CreateSubAdminContext = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
  adminAccount: web3.PublicKey;
};

/**
 * @name CloseSubAdminContext
 * @description The accounts required for closing a sub-admin account.
 * @property authority - The public key of the authority.
 * @property closeSubAdminAccount - The public key of the sub-admin account to be closed.
 * @property subAdminAccount - The public key of the existing sub-admin account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type CloseSubAdminContext = {
  authority: web3.PublicKey;
  closeSubAdminAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type AddEventAccessAccounts = {
  authority: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  signerSubAdminAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type RemoveEventAccessAccounts = {
  authority: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  signerSubAdminAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type UpdateSubAdminLevelArgs = {
  level: any;
};

export type UpdateSubAdminLevelAccounts = {
  authority: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  signerSubAdminAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};
