import { CubikSDK } from "..";
import { EVENT_PREFIX, SPONSOR_PREFIX } from "../constants";
import {
  SponsorCreateAccounts,
  SponsorCreateArgs,
  SponsorCreateCustodyAccounts,
  SponsorCreateCustodyArgs,
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

    getSponsor: async (pda: web3.PublicKey) => {
      return await sdk.program.account.sponsor.fetch(pda);
    },

    getPDA: (createKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [SPONSOR_PREFIX,createKey.toBuffer()],
        sdk.programId
      );
    },

    getSponsorPDA: (eventKey: web3.PublicKey , createKey : web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [SPONSOR_PREFIX, eventKey.toBuffer(), createKey.toBuffer()],
        sdk.programId
      );
    },

    getEventPDA: (eventAccount: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [EVENT_PREFIX, eventAccount.toBuffer()],
        sdk.programId
      );
    },
  };
};
