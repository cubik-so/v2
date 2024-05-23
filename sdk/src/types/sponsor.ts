import { web3 } from "@coral-xyz/anchor";

/**
 * @name SponsorCreateArgs
 * @description Arguments required to create a sponsor.
 * @property metadata - A string containing descriptive metadata about the sponsor.
 */
export type SponsorCreateArgs = {
  metadata: string;
};

/**
 * @name SponsorCreateAccounts
 * @description Accounts required for creating a sponsor.
 * @property authority - The public key of the authority.
 * @property createKey - The public key to createkey.
 * @property sponsorAccount - The main sponsor account public key.
 * @property eventAccount - The public key of the event associated with the sponsor.
 * @property systemProgram - The public key of system program.
 */
export type SponsorCreateAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name SponsorCreateCustodyArgs
 * @description Arguments required to initialize a sponsor with custody.
 * @property metadata - Descriptive metadata about the sponsor.
 * @property member - The public key of a member associated with the sponsor account.
 * @property memo - Optional memo related to the sponsor initialization (nullable).
 */
export type SponsorCreateCustodyArgs = {
  metadata: string;
  member: web3.PublicKey;
  memo: string | null;
};

/**
 * @name SponsorCreateCustodyAccounts
 * @description Accounts required for initializing a sponsor with specific custody features, ensuring additional controls and configurations.
 * @property authority - The public key of the authority executing the initialization.
 * @property createKey - The public key used for creation.
 * @property sponsorAccount - The main sponsor account public key.
 * @property eventAccount - The public key of the event associated with the sponsor.
 * @property programConfigPda - Program Derived Address for configuration.
 * @property treasury - Public key for the treasury associated with the sponsor.
 * @property multisig - Public key for the multisig configuration, enhancing security.
 * @property squadProgram - Public key of the squads program, for managing team-based operations.
 * @property systemProgram - Reference to the Solana system program.
 */

export type SponsorCreateCustodyAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  programConfigPda: web3.PublicKey;
  treasury: web3.PublicKey;
  multisig: web3.PublicKey;
  squadProgram: web3.PublicKey;
  systemProgram: web3.PublicKey;
};
