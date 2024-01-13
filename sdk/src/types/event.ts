import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name CreateEventHandlerArgs
 * @description The arguments required to create an event.
 * @property matchingPool - The matching pool amount for the event.
 */
export type CreateEventHandlerArgs = {
  matchingPool: BN;
};

/**
 * @name CreateEventAccounts
 * @description The accounts required for creating an event.
 * @property authority - The public key of the authority executing the action.
 * @property eventAccount - The public key of the event account.
 * @property subAdminAccount - The public key of the sub-admin account.
 * @property eventKey - The public key of the event key.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type CreateEventAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  eventKey: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name CreateEventJoinHandlerArgs
 * @description The arguments required to create an event join.
 * @property counter - The counter for the event join.
 * @property eventKey - The public key of the event.
 */
export type CreateEventJoinHandlerArgs = {
  counter: BN;
  eventKey: web3.PublicKey;
};

/**
 * @name CreateEventJoinAccounts
 * @description The accounts required for creating an event join.
 * @property authority - The public key of the authority executing the action.
 * @property eventJoinAccount - The public key of the event join account.
 * @property eventAccount - The public key of the event account.
 * @property projectAccount - The public key of the project account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type CreateEventJoinAccounts = {
  authority: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

// Define this enum based on your Rust code for EventProjectStatus
export enum EventProjectStatus {
  PendingApproval,
  Approved,
  // ...other statuses
}

/**
 * @name UpdateEventStatusArgs
 * @description The arguments required to update an event's status.
 * @property status - The new status of the event.
 */
export type UpdateEventStatusArgs = {
  status: EventProjectStatus;
};

/**
 * @name UpdateEventStatusAccounts
 * @description The accounts required for updating an event's status.
 * @property authority - The public key of the authority executing the action.
 * @property eventAccount - The public key of the event account.
 * @property eventJoinAccount - The public key of the event join account.
 * @property projectAccount - The public key of the project account.
 * @property subAdminAccount - The public key of the sub-admin account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type UpdateEventStatusAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name UpdateEventArgs
 * @description The arguments required to update an event.
 * @property matchingPool - The matching pool amount for the event.
 */
export type UpdateEventArgs = {
  matchingPool: BN;
};

/**
 * @name UpdateEventAccounts
 * @description The accounts required for updating an event.
 * @property authority - The public key of the authority executing the action.
 * @property eventAccount - The public key of the event account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type UpdateEventAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

/**
 * @name InviteEventJoinAccounts
 * @description The accounts required for inviting to join an event.
 * @property authority - The public key of the authority executing the invitation.
 * @property eventJoinAccount - The public key of the event join account.
 * @property subAdminAccount - The public key of the sub-admin account.
 * @property projectAccount - The public key of the project account.
 * @property eventAccount - The public key of the event account.
 * @property systemProgram - The public key of the system program.
 * @property rent - The public key of the rent sysvar.
 */
export type InviteEventJoinAccounts = {
  authority: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};
