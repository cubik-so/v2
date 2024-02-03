import { web3 } from '@coral-xyz/anchor';
import { CubikSDK } from '..';
import {
  CreateEventAccounts,
  CreateEventHandlerArgs,
  CreateEventJoinAccounts,
  CreateEventJoinHandlerArgs,
  InviteEventJoinAccounts,
  UpdateEventAccounts,
  UpdateEventArgs,
  UpdateEventStatusAccounts,
  UpdateEventStatusArgs,
} from '../types';

export const event = (sdk: CubikSDK) => {
  return {
    create: async (
      args: CreateEventHandlerArgs,
      accounts: CreateEventAccounts
    ) => {
      const ix = await sdk.program.methods
        .createEvent(args.matchingPool)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    createEventJoin: async (
      args: CreateEventJoinHandlerArgs,
      accounts: CreateEventJoinAccounts
    ) => {
      const ix = await sdk.program.methods
        .createEventJoin(args.counter, args.eventKey)
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
        [Buffer.from('event'), eventKey.toBuffer()],
        sdk.programId
      );
    },

    getEventJoinPDA: (
      eventAccount: web3.PublicKey,
      projectAccount: web3.PublicKey
    ) => {
      return web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('event_join'),
          eventAccount.toBuffer(),
          projectAccount.toBuffer(),
        ],
        sdk.programId
      );
    },
  };
};
