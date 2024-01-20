import { CubikSDK } from "..";
import {
  DonationSOLAccounts,
  DonationSOLArgs,
  DonationSPLAccounts,
  DonationSPLArgs,
} from "../types/donation";

export const donate = (sdk: CubikSDK) => {
  return {
    sol: async (args: DonationSOLArgs, accounts: DonationSOLAccounts) => {
      const ix = await sdk.program.methods
        .donateSol(args.amount)
        .accounts(accounts)
        .instruction();

      return ix;
    },
    spl: async (args: DonationSPLArgs, accounts: DonationSPLAccounts) => {
      const ix = await sdk.program.methods
        .donateSpl(args.amount)
        .accounts(accounts)
        .instruction();

      return ix;
    },
  };
};
