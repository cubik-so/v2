import { CubikSDK } from '..';
import {
  AddMemberSponsorArgs,
  FundSponsorSOLArgs,
  FundSponsorSOLAccounts,
  FundSponsorSPLArgs,
  FundSponsorSPLAccounts,
  SponsorTeamAccounts,
  InitSponsorWithSelfCustodyArgs,
  InitSponsorWithSelfCustodyAccounts,
  InitSponsorWithoutSelfCustodyArgs,
  InitSponsorWithoutSelfCustodyAccounts,
  InitCubikSponsorArgs,
  InitCubikSponsorAccounts,
} from '../types';
import { web3 } from '@coral-xyz/anchor';

export const sponsor = (sdk: CubikSDK) => {
  return {
    initWithSelfCustody: async (
      args: InitSponsorWithSelfCustodyArgs,
      accounts: InitSponsorWithSelfCustodyAccounts
    ) => {
      const ix = await sdk.program.methods
        .initSponsorWithSelfCustody(
          args.totalCommitted,
          args.membersKeys,
          args.threshold,
          args.configAuthority,
          args.timeLock,
          args.memo
        )
        .accounts(accounts)
        .instruction();

      return ix;
    },

    initWithoutSelfCustody: async (
      args: InitSponsorWithoutSelfCustodyArgs,
      accounts: InitSponsorWithoutSelfCustodyAccounts
    ) => {
      const ix = await sdk.program.methods
        .initSponsorWithoutSelfCustody(args.totalCommitted)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    initCubikSponsor: async (
      args: InitCubikSponsorArgs,
      accounts: InitCubikSponsorAccounts
    ) => {
      const ix = await sdk.program.methods
        .initCubikSponsor(
          args.totalCommitted,
          args.membersKeys,
          args.threshold,
          args.configAuthority,
          args.timeLock,
          args.memo
        )
        .accounts(accounts)
        .instruction();

      return ix;
    },

    addMember: async (
      args: AddMemberSponsorArgs,
      accounts: SponsorTeamAccounts
    ) => {
      const ix = await sdk.program.methods
        .addMemberSponsor(args.teamMemberKey)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    _removeMember: async (
      args: AddMemberSponsorArgs,
      accounts: SponsorTeamAccounts
    ) => {
      const ix = await sdk.program.methods
        .removeMemberSponsor(args.teamMemberKey)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    fundSponsorSol: async (
      args: FundSponsorSOLArgs,
      accounts: FundSponsorSOLAccounts
    ) => {
      const ix = await sdk.program.methods
        .fundSponsorSol(args.amount)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    fundSponsorSpl: async (
      args: FundSponsorSPLArgs,
      accounts: FundSponsorSPLAccounts
    ) => {
      const ix = await sdk.program.methods
        .fundSponsorSpl(args.amount)
        .accounts(accounts)
        .instruction();

      return ix;
    },
    getSponsor: async (pda: web3.PublicKey) => {
      return await sdk.program.account.sponsor.fetch(pda);
    },
    getPDA: (createKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from('sponsor'), createKey.toBuffer()],
        sdk.programId
      );
    },
    getCubikSponsorPDA: (eventKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from('sponsor'), eventKey.toBuffer()],
        sdk.programId
      );
    },

    getTeamPDA: (createKey: web3.PublicKey, authority: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from('sponsor'), createKey.toBuffer(), authority.toBuffer()],
        sdk.programId
      );
    },
  };
};
