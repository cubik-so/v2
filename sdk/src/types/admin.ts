import { web3 } from "@coral-xyz/anchor";

/**
 * @name CreateAdminAccounts
 * @description
 * The accounts required to create an admin.
 *
 * @property authority - The authority creating the admin.
 * @property adminAccount - The admin account to be created.
 *
 * @category types
 * @example
 * const accounts: CreateAdminAccounts = {
 *  authority: adminKeypair.publicKey,
 *  adminAccount: adminPDA,
 * };
 *
 */
export type CreateAdminAccounts = {
  authority: web3.PublicKey; // Authority creating the admin
  adminAccount: web3.PublicKey; // Admin account to be created
};

/**
 * @name CreateAdminSigners
 * @description
 * The signers required to create an admin.
 *
 * @category types
 * @example
 * const signers: CreateAdminSigners = [adminKeypair];
 *
 */
export type CreateAdminSigners = web3.Keypair[];
