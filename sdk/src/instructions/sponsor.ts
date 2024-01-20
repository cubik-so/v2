import { CubikSDK } from "..";
import {
  AddMemberSponsorArgs,
  FundSponsorSOLArgs,
  FundSponsorSOLAccounts,
  FundSponsorSPLArgs,
  FundSponsorSPLAccounts,
  InitSponsorAccounts,
  InitSponsorArgs,
  SponsorTeamAccounts,
} from "../types";
import { web3 } from "@coral-xyz/anchor";

export const sponsor = (sdk: CubikSDK) => {
  return {
    init: async (args: InitSponsorArgs, accounts: InitSponsorAccounts) => {
      const ix = await sdk.program.methods
        .initSponsor(
          args.totalCommitted,
          args.membersKeys,
          args.threshold,
          args.configAuthority,
          args.timeLock,
          args.memo,
        )
        .accounts(accounts)
        .instruction();

      return ix;
    },

    addMember: async (
      args: AddMemberSponsorArgs,
      accounts: SponsorTeamAccounts,
    ) => {
      const ix = await sdk.program.methods
        .addMemberSponsor(args.teamMemberKey)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    _removeMember: async (
      args: AddMemberSponsorArgs,
      accounts: SponsorTeamAccounts,
    ) => {
      const ix = await sdk.program.methods
        .removeMemberSponsor(args.teamMemberKey)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    fundSponsorSol: async (
      args: FundSponsorSOLArgs,
      accounts: FundSponsorSOLAccounts,
    ) => {
      const ix = await sdk.program.methods
        .fundSponsorSol(args.amount)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    fundSponsorSpl: async (
      args: FundSponsorSPLArgs,
      accounts: FundSponsorSPLAccounts,
    ) => {
      const ix = await sdk.program.methods
        .fundSponsorSpl(args.amount)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    getPDA: (createKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("sponsor"), createKey.toBuffer()],
        sdk.programId,
      );
    },

    getTeamPDA: (createKey: web3.PublicKey, authority: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("sponsor"), createKey.toBuffer(), authority.toBuffer()],
        sdk.programId,
      );
    },
  };
};
