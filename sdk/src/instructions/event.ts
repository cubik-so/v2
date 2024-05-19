import { web3 } from "@coral-xyz/anchor";
import { CubikSDK } from "..";
import {
  CreateEventAccounts,
  CreateEventHandlerArgs,
  EventParticipantCreateAccounts,
  EventParticipantInviteAccounts,
  EventTeamCreateAccounts,
  EventTeamCreateArgs,
  UpdateEventAccounts,
  UpdateEventArgs,
} from "../types";
import { EVENT_PARTICIPANT_PREFIX, EVENT_PREFIX } from "../constants";

export const event = (sdk: CubikSDK) => {
  return {
    create: async (
      accounts: CreateEventAccounts,
      args: CreateEventHandlerArgs
    ) => {
      return await sdk.program.methods
        .eventCreate(args)
        .accounts(accounts)
        .instruction();
    },

    update: async (accounts: UpdateEventAccounts, args: UpdateEventArgs) => {
      return await sdk.program.methods
        .eventUpdate(args)
        .accounts(accounts)
        .instruction();
    },

    teamCreate: async (
      accounts: EventTeamCreateAccounts,
      args: EventTeamCreateArgs
    ) => {
      return await sdk.program.methods
        .eventTeamCreate(args)
        .accounts(accounts)
        .instruction();
    },

    participant: {
      create: async (accounts: EventParticipantCreateAccounts) => {
        return await sdk.program.methods
          .eventParticipantCreate()
          .accounts(accounts)
          .instruction();
      },

      invite: async (accounts: EventParticipantInviteAccounts) => {
        return await sdk.program.methods
          .eventParticipantInvite()
          .accounts(accounts)
          .instruction();
      },

      getPDA: (
        eventAccount: web3.PublicKey,
        projectAccount: web3.PublicKey
      ) => {
        return web3.PublicKey.findProgramAddressSync(
          [
            EVENT_PARTICIPANT_PREFIX,
            eventAccount.toBuffer(),
            projectAccount.toBuffer(),
          ],
          sdk.programId
        );
      },
    },

    getPDA: (eventKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [EVENT_PREFIX, eventKey.toBuffer()],
        sdk.programId
      );
    },

    get: (pda: web3.PublicKey) => {
      return sdk.program.account.event.fetch(pda);
    },
  };
};
