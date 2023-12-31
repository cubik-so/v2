import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name InitSponsorArgs
 * @description The arguments required to initialize a sponsor.
 * @property vault - The public key of the vault.
 * @property totalCommitted - The total committed amount in USD.
 */
export type InitSponsorArgs = {
  vault: web3.PublicKey;
  totalCommitted: BN;
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
 * @name InitSponsorSigners
 * @description The signers required to initialize a sponsor.
 */
export type InitSponsorSigners = web3.Keypair[];

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
 * @name UpdateSponsorSigners
 * @description The signers required to update a sponsor.
 */
export type UpdateSponsorSigners = web3.Keypair[];

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
 * @name SponsorTeamSigners
 * @description The signers required for adding a member to a sponsor team.
 */
export type SponsorTeamSigners = web3.Keypair[];

/**
 * @name FundSponsorVaultSPLArgs
 * @description The arguments required to fund a sponsor's SPL token vault.
 * @property amount - The amount of SPL tokens to transfer.
 * @property amountUsd - The equivalent amount in USD.
 */
export type FundSponsorVaultSPLArgs = {
  amount: BN;
  amountUsd: BN;
};

/**
 * @name FundSponsorVaultSPLAccounts
 * @description The accounts required for funding a sponsor's SPL token vault.
 * @property authority - The public key of the authority executing the action.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property tokenMint - The public key of the token mint.
 * @property tokenAtaSender - The public key of the sender's token account.
 * @property tokenAtaReceiver - The public key of the receiver's token account.
 * @property systemProgram - The public key of the system program.
 * @property tokenProgram - The public key of the token program.
 * @property rent - The public key of the rent sysvar.
 */
export type FundSponsorVaultSPLAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  tokenMint: web3.PublicKey;
  tokenAtaSender: web3.PublicKey;
  tokenAtaReceiver: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name FundSponsorVaultSPLSigners
 * @description The signers required for funding a sponsor's SPL token vault.
 */
export type FundSponsorVaultSPLSigners = web3.Keypair[];

/**
 * @name FundSponsorVaultSOLArgs
 * @description The arguments required to fund a sponsor's SOL vault.
 * @property amount - The amount of SOL to transfer.
 * @property amountUsd - The equivalent amount in USD.
 */
export type FundSponsorVaultSOLArgs = {
  amount: BN;
  amountUsd: BN;
};

/**
 * @name FundSponsorVaultSOLAccounts
 * @description The accounts required for funding a sponsor's SOL vault.
 * @property authority - The public key of the authority executing the action.
 * @property sponsorAccount - The public key of the sponsor account.
 * @property receiverAccount - The public key of the receiver account.
 * @property systemProgram - The public key of the system program.
 * @property tokenProgram - The public key of the token program.
 * @property rent - The public key of the rent sysvar.
 */
export type FundSponsorVaultSOLAccounts = {
  authority: web3.PublicKey;
  sponsorAccount: web3.PublicKey;
  receiverAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  tokenProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name FundSponsorVaultSOLSigners
 * @description The signers required for funding a sponsor's SOL vault.
 */
export type FundSponsorVaultSOLSigners = web3.Keypair[];
