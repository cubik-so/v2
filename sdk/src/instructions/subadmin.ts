import { web3 } from '@coral-xyz/anchor';
import { CubikSDK } from '..';
import {
  AddEventAccessAccounts,
  AddEventAccessArgs,
  CloseSubAdminContext,
  CreateSubAdminContext,
  CreateSubAdminHandlerArgs,
  RemoveEventAccessAccounts,
  RemoveEventAccessArgs,
} from '../types';

export const subAdmin = (sdk: CubikSDK) => {
  return {
    get: async (pda: web3.PublicKey) => {
      return await sdk.program.account.subAdmin.fetch(pda);
    },
    create: async (
      args: CreateSubAdminHandlerArgs,
      accounts: CreateSubAdminContext
    ) => {
      const ix = await sdk.program.methods
        .createSubAdmin(args.newSubAdminAuthority, args.level)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    close: async (accounts: CloseSubAdminContext) => {
      const ix = await sdk.program.methods
        .closeSubAdmin()
        .accounts(accounts)
        .instruction();

      return ix;
    },

    addEventAccess: async (
      args: AddEventAccessArgs,
      accounts: AddEventAccessAccounts
    ) => {
      const ix = await sdk.program.methods
        .addEventAccess(args.eventKey)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    removeEventAccess: async (
      args: RemoveEventAccessArgs,
      accounts: RemoveEventAccessAccounts
    ) => {
      const ix = await sdk.program.methods
        .removeEventAccess(args.eventKey)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    getPDA: (subAdmin: web3.PublicKey, createKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from('admin'), subAdmin.toBuffer(), createKey.toBuffer()],
        sdk.programId
      );
    },
  };
};
