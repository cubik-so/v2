import { CubikSDK } from '..';
import {
  ContributionSolAccounts,
  ContributionSolArgs,
  ContributionSplAccounts,
  ContributionSplArgs,
} from '../types';

export const contribution = (sdk: CubikSDK) => {
  return {
    sol: async (
      args: ContributionSolArgs,
      accounts: ContributionSolAccounts
    ) => {
      const ix = await sdk.program.methods
        .contributionSol(args.amount, args.split)
        .accounts(accounts)
        .instruction();

      return ix;
    },
    spl: async (
      args: ContributionSplArgs,
      accounts: ContributionSplAccounts
    ) => {
      const ix = await sdk.program.methods
        .contributionSpl(args.amount, args.split)
        .accounts(accounts)
        .instruction();

      return ix;
    },
  };
};
