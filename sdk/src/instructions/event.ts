import { web3 } from "@coral-xyz/anchor";
import { CubikSDK } from "..";
import {
  CreateEventAccounts,
  CreateEventHandlerArgs,
  CreateEventJoinAccounts,
  InviteEventJoinAccounts,
  UpdateEventAccounts,
  UpdateEventArgs,
  UpdateEventStatusAccounts,
  UpdateEventStatusArgs,
} from "../types";

export const event = (sdk: CubikSDK) => {
  return {
    create: async (
      args: CreateEventHandlerArgs,
      accounts: CreateEventAccounts
    ) => {
      const ix = await sdk.program.methods
        .createEvent(args.matchingPool, args.event_admin_signer)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    createEventJoin: async (accounts: CreateEventJoinAccounts) => {
      const ix = await sdk.program.methods
        .createEventJoin()
        .accounts(accounts)
        .instruction();

      return ix;
    },

    update: async (args: UpdateEventArgs, accounts: UpdateEventAccounts) => {
      const ix = await sdk.program.methods
        .updateEvent(args.matchingPool)
        .accounts(accounts)
        .instruction();
      return ix;
    },

    updateStatus: async (
      args: UpdateEventStatusArgs,
      accounts: UpdateEventStatusAccounts
    ) => {
      const ix = await sdk.program.methods
        .updateEventJoinStatus(args.status)
        .accounts({
          authority: accounts.authority,
          eventAccount: accounts.eventAccount,
          eventJoinAccount: accounts.eventJoinAccount,
          projectAccount: accounts.projectAccount,
          subAdminAccount: accounts.subAdminAccount,
          rent: accounts.rent,
          systemProgram: accounts.systemProgram,
        })
        .instruction();
      return ix;
    },
    inviteEventJoin: async (accounts: InviteEventJoinAccounts) => {
      const ix = await sdk.program.methods
        .inviteEventJoin()
        .accounts(accounts)
        .instruction();
      return ix;
    },

    getPDA: (eventKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("event"), eventKey.toBuffer()],
        sdk.programId
      );
    },
    getEventJoin: (pda: web3.PublicKey) => {
      return sdk.program.account.eventJoin.fetch(pda);
    },

    get: (pda: web3.PublicKey) => {
      return sdk.program.account.event.fetch(pda);
    },
    getEventJoinPDA: (
      eventAccount: web3.PublicKey,
      projectAccount: web3.PublicKey
    ) => {
      return web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("event_join"),
          eventAccount.toBuffer(),
          projectAccount.toBuffer(),
        ],
        sdk.programId
      );
    },
  };
};
