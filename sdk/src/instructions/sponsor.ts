import { CubikSDK } from "..";
import { EVENT_PREFIX, SPONSOR_PREFIX } from "../constants";
import {
  SponsorCloseAccount,
  SponsorCreateAccounts,
  SponsorCreateArgs,
  SponsorCreateCustodyAccounts,
  SponsorCreateCustodyArgs,
  SponsorUpdateAccounts,
  SponsorUpdateArgs,
} from "../types";
import { web3 } from "@coral-xyz/anchor";

export const sponsor = (sdk: CubikSDK) => {
  return {
    create: async (
      accounts: SponsorCreateAccounts,
      args: SponsorCreateArgs
    ) => {
      return await sdk.program.methods
        .sponsorCreate(args)
        .accounts(accounts)
        .instruction();
    },

    createCustody: async (
      accounts: SponsorCreateCustodyAccounts,
      args: SponsorCreateCustodyArgs
    ) => {
      return await sdk.program.methods
        .sponsorCreateCustody(args)
        .accounts(accounts)
        .instruction();
    },

    update: async (
      accounts: SponsorUpdateAccounts,
      args: SponsorUpdateArgs
    ) => {
      return await sdk.program.methods
        .sponsorUpdate(args)
        .accounts(accounts)
        .instruction();
    },

    close: async (accounts: SponsorCloseAccount) => {
      return await sdk.program.methods
        .sponsorClose()
        .accounts(accounts)
        .instruction();
    },

    get: async (pda: web3.PublicKey) => {
      return await sdk.program.account.sponsor.fetch(pda);
    },

    getPDA: (eventKey: web3.PublicKey, createKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [SPONSOR_PREFIX, eventKey.toBuffer(), createKey.toBuffer()],
        sdk.programId
      );
    },

    event: {
      getPDA: (eventAccount: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [EVENT_PREFIX, eventAccount.toBuffer()],
          sdk.programId
        );
      },
    },
  };
};
