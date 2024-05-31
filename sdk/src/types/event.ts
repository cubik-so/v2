import { BN, web3 } from "@coral-xyz/anchor";

/**
 * @name CreateEventHandlerArgs
 *
 * @description
 * Arguments required to create an event in the system.
 *
 * @property metadata - A string containing metadata about the event.
 * @property startSlot - The starting slot on the blockchain for the event.
 * @property endingSlot - The ending slot on the blockchain for the event.
 * @property memo - Optional memo about the event (nullable).
 */

export type CreateEventHandlerArgs = {
  metadata: string;
  startSlot: BN;
  endingSlot: BN;
  memo: string | null;
};

/**
 * @name CreateEventAccounts
 * @description The accounts required for creating an event.
 * @property authority - The public key of the authority.
 * @property createKey - The public key used for event creation.
 * @property eventTeamAccount - A team account associated with the event.
 * @property eventAccount - The event account associated with the event.
 * @property programConfigPda - Program Derived Address (PDA) for configuration.
 * @property treasury - Treasury Account holding the event.
 * @property multisig - Account for multi-signature.
 * @property squadProgram - Public key of squad program.
 * @property systemProgram -  The public key of the system program.
 */

export type CreateEventAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  eventTeamAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  programConfigPda: web3.PublicKey;
  treasury: web3.PublicKey;
  multisig: web3.PublicKey;
  squadProgram: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name UpdateEventArgs
 * @description Arguments required to update an existing event.
 * @property metadata - Optional new metadata for the event.
 * @property endingSlot - Optional new ending slot on the blockchain for the event (nullable).
 * @property startSlot - Optional new starting slot on the blockchain for the event (nullable).
 */
export type UpdateEventArgs = {
  metadata: string | null;
  endingSlot: BN | null;
  startSlot: BN | null;
};

/**
 * @name UpdateEventAccounts
 * @description Accounts required for updating an event, focusing on authorization and the specific event to be updated.
 * @property authority - The public key of the authority executing the action.
 * @property eventTeamAccount - A team-specific account that might have additional permissions or roles.
 * @property eventAccount - The main account associated with the event.
 * @property systemProgram - Reference to the system program.
 */
export type UpdateEventAccounts = {
  authority: web3.PublicKey;
  eventTeamAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name EventTeamCreateAccounts
 * @description Accounts required to add a new team member to an event's managing team.
 * @property authority - The public key of the authority executing the action.
 * @property eventAccount - The public key of the main event account.
 * @property eventTeamAccount - The public key of the existing event team account.
 * @property systemProgram - Reference to the system program.
 */
export type EventTeamCreateAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventTeamAccount: web3.PublicKey;
  newEventTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name EventTeamCreateArgs
 * @description Arguments for adding a new team member to an event's team.
 * @property newTeamMember - The public key of the new team member being added.
 */
export type EventTeamCreateArgs = {
  newTeamMember: web3.PublicKey;
};

/**
 * @name EventTeamCloseAccounts
 * @description Accounts required to close a team member account from an event's managing team.
 * @property authority - The public key of the authority executing the action.
 * @property eventAccount - The public key of the main event account.
 * @property toCloseEventTeamAccount - The public key of the event team account to be closed.
 * @property systemProgram - Reference to the system program.
 */

export type EventTeamCloseAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  toCloseEventTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name EventParticipantCreateAccounts
 * @description Accounts required to register a participant for an event.
 * @property authority - The public key of the authority executing the action.
 * @property eventParticipantAccount - The public key of the participant's account.
 * @property projectAccount - The public key of the associated project account.
 * @property eventAccount - The public key of the event account.
 * @property systemProgram - Reference to the system program.
 */

export type EventParticipantCreateAccounts = {
  authority: web3.PublicKey;
  eventParticipantAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name EventParticipantUpdateArgs
 * @description Arguments required to update an event participant's status.
 * @property status - The new status to update for the event participant.
 */

export type EventParticipantUpdateArgs = {
  status: {
    approved: {};
    // pendingApproval: {};
    // rejected: {};
  };
};

/**
 * @name EventParticipantUpdateAccounts
 * @description Accounts required to update an event participant's status.
 * @property team - The public key of the team updating the participant's status.
 * @property eventParticipantAccount - The public key of the event participant account.
 * @property projectAccount - The public key of the associated project account.
 * @property eventAccount - The public key of the main event account.
 * @property eventTeamAccount - The public key of the event team account.
 * @property systemProgram - Reference to the system program.
 */
export type EventParticipantUpdateAccounts = {
  team: web3.PublicKey;
  eventParticipantAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};

/**
 * @name EventParticipantInviteAccounts
 * @description Accounts required to invite a participant to join an event.
 * @property team - The public key of the team inviting the participant.
 * @property eventParticipantAccount - The public key of the participant's account.
 * @property projectAccount - The public key of the associated project account.
 * @property eventAccount - The public key of the event account.
 * @property eventTeamAccount - The public key of the event team account.
 * @property systemProgram - Reference to the system program.
 */
export type EventParticipantInviteAccounts = {
  team: web3.PublicKey;
  eventParticipantAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  eventTeamAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
};
