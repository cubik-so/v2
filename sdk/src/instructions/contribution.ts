import { CubikSDK } from "..";
import {
  ContributionSolAccounts,
  ContributionSolArgs,
  ContributionSplAccounts,
  ContributionSplArgs,
} from "../types";

export const contribution = (sdk: CubikSDK) => {
  return {
    sol: async (
      accounts: ContributionSolAccounts,
      args: ContributionSolArgs
    ) => {
      return await sdk.program.methods
        .contributionSol(args)
        .accounts(accounts)
        .instruction();
    },
    spl: async (
      accounts: ContributionSplAccounts,
      args: ContributionSplArgs
    ) => {
      return await sdk.program.methods
        .contributionSpl(args)
        .accounts(accounts)
        .instruction();
    },
  };
};
