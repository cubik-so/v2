import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name InitSponsorArgs
 * @description The arguments required to initialize a sponsor.
 * @property vault - The public key of the vault.
 * @property totalCommitted - The total committed amount in USD.
 */
export type InitSponsorArgs = {
  totalCommitted: BN; // Using BN to represent u128 since JavaScript does not support 128-bit integers
  membersKeys: web3.PublicKey[]; // Array of public keys
  threshold: number; // u16 can be represented as a number in TypeScript
  configAuthority: web3.PublicKey | null; // Option<Pubkey> translates to PublicKey or null
  timeLock: number; // u32 can be represented as a number in TypeScript
  memo: string | null; // Option<String> translates to string or null
};

/**
 * @name InitSponsorAccounts
 * @description The accounts required for initializing a sponsor.
 * @property authority - The public key of the authority executing the initialization.
 * @property createKey - The public key used for creation.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property sponsorTeamAccount - The public key of the sponsor team account.
 * @property systemProgram - The public key of the system program.
 * @property tokenProgram - The public key of the token program.
 * @property rent - The public key of the rent sysvar.
 */
export type InitSponsorAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name UpdateSponsorArgs
 * @description The arguments required to update a sponsor.
 * @property totalCommitted - The total committed amount in USD.
 */
export type UpdateSponsorArgs = {
  totalCommitted: BN;
};

/**
 * @name UpdateSponsorAccounts
 * @description The accounts required for updating a sponsor.
 * @property authority - The public key of the authority executing the update.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property sponsorTeamAccount - The public key of the sponsor team account.
 * @property systemProgram - The public key of the system program.
 * @property tokenProgram - The public key of the token program.
 * @property rent - The public key of the rent sysvar.
 */
export type UpdateSponsorAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name AddMemberSponsorArgs
 * @description The arguments required to add a member to a sponsor team.
 * @property teamMemberKey - The public key of the team member being added.
 */
export type AddMemberSponsorArgs = {
  teamMemberKey: web3.PublicKey;
};

/**
 * @name SponsorTeamAccounts
 * @description The accounts required for adding a member to a sponsor team.
 * @property authority - The public key of the authority executing the action.
 * @property sponsorTeamAccount - The public key of the sponsor team account.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property systemProgram - The public key of the system program.
 * @property tokenProgram - The public key of the token program.
 * @property rent - The public key of the rent sysvar.
 */
export type SponsorTeamAccounts = {
  authority: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name FundSponsorSPLArgs
 * @description The arguments required to fund a sponsor's SPL token vault.
 * @property amount - The amount of SPL tokens to transfer.
 */
export type FundSponsorSPLArgs = {
  amount: BN;
};

/**
 * @name FundSponsorSPLAccounts
 * @description The accounts required for funding a sponsor's SPL token vault.
 */
export type FundSponsorSPLAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  tokenMint: web3.PublicKey;
  tokenAtaSender: web3.PublicKey;
  tokenAtaReceiver: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name FundSponsorSOLArgs
 * @description The arguments required to fund a sponsor's SOL vault.
 * @property amount - The amount of SOL to transfer.
 */
export type FundSponsorSOLArgs = {
  amount: BN;
};

/**
 * @name FundSponsorSOLAccounts
 * @description The accounts required for funding a sponsor's SOL vault.
 */
export type FundSponsorSOLAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  receiver: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};
