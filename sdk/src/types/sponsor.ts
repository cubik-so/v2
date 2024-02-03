import { BN, web3 } from '@coral-xyz/anchor';

/**
 * @name InitSponsorWithSelfCustodyArgs
 * @description The arguments required to initialize a sponsor.
 * @property totalCommitted - The total committed amount in USD.
 * @property membersKeys - The public keys of the members.
 * @property threshold - The threshold for the multisig.
 * @property configAuthority - The public key of the config authority.
 * @property timeLock - The time lock.
 * @property memo - The memo.
 */
export type InitSponsorWithSelfCustodyArgs = {
  totalCommitted: BN; // Using BN to represent u128 since JavaScript does not support 128-bit integers
  membersKeys: web3.PublicKey[]; // Array of public keys
  threshold: number; // u16 can be represented as a number in TypeScript
  configAuthority: web3.PublicKey | null; // Option<Pubkey> translates to PublicKey or null
  timeLock: number; // u32 can be represented as a number in TypeScript
  memo: string | null; // Option<String> translates to string or null
};

/**
 * @name InitSponsorWithSelfCustodyAccounts
 * @description The accounts required for initializing a sponsor.
 * @property authority - The public key of the authority executing the initialization.
 * @property createKey - The public key used for creation.
 * @property userAccount - The public key of the user account.
 * @property eventAccount - The public key of the event account.
 * @property multisig - The public key of the multisig.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property squadsProgram - The public key of the squads program.
 * @property sponsorTeamAccount - The public key of the sponsor team account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type InitSponsorWithSelfCustodyAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  userAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  multisig: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  squadsProgram: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name InitSponsorWithoutSelfCustodyArgs
 * @description The arguments required to initialize a sponsor.
 * @property totalCommitted - The total committed amount in USD.
 * @property membersKeys - The public keys of the members.
 * @property threshold - The threshold for the multisig.
 * @property configAuthority - The public key of the config authority.
 * @property timeLock - The time lock.
 * @property memo - The memo.
 */
export type InitSponsorWithoutSelfCustodyArgs = {
  totalCommitted: BN; // Using BN to represent u128 since JavaScript does not support 128-bit integers
};

/**
 * @name InitSponsorWithoutSelfCustodyAccounts
 * @description The accounts required for initializing a sponsor.
 * @property authority - The public key of the authority executing the initialization.
 * @property createKey - The public key used for creation.
 * @property userAccount - The public key of the user account.
 * @property eventAccount - The public key of the event account.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property cubikSponsor - The public key of the cubik sponsor account.
 * @property sponsorTeamAccount - The public key of the sponsor team account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type InitSponsorWithoutSelfCustodyAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  userAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  cubikSponsor: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name InitCubikSponsorArgs
 * @description The arguments required to initialize a sponsor.
 * @property totalCommitted - The total committed amount in USD.
 * @property membersKeys - The public keys of the members.
 * @property threshold - The threshold for the multisig.
 * @property configAuthority - The public key of the config authority.
 * @property timeLock - The time lock.
 * @property memo - The memo.
 */
export type InitCubikSponsorArgs = {
  totalCommitted: BN; // Using BN to represent u128 since JavaScript does not support 128-bit integers
  membersKeys: web3.PublicKey[]; // Array of public keys
  threshold: number; // u16 can be represented as a number in TypeScript
  configAuthority: web3.PublicKey | null; // Option<Pubkey> translates to PublicKey or null
  timeLock: number; // u32 can be represented as a number in TypeScript
  memo: string | null; // Option<String> translates to string or null
};

/**
 * @name InitCubikSponsorAccounts
 * @description The accounts required for initializing a sponsor.
 * @property authority - The public key of the authority executing the initialization.
 * @property createKey - The public key used for creation.
 * @property userAccount - The public key of the user account.
 * @property subAdminAccount - The public key of the sub admin account.
 * @property eventAccount - The public key of the event account.
 * @property multisig - The public key of the multisig.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property squadsProgram - The public key of the squads program.
 * @property sponsorTeamAccount - The public key of the sponsor team account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type InitCubikSponsorAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  userAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  multisig: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  squadsProgram: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
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
 * @property rent - The public key of the rent sysvar.
 */
export type UpdateSponsorAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
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
 * @property rent - The public key of the rent sysvar.
 */
export type SponsorTeamAccounts = {
  authority: web3.PublicKey;
  sponsorTeamAccount: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
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
