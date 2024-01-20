import { web3 } from "@coral-xyz/anchor";
import { CubikSDK } from "..";
import { CreateAdminAccounts } from "../types";

export const admin = (sdk: CubikSDK) => {
  return {
    create: async (accounts: CreateAdminAccounts) => {
      const ix = await sdk.program.methods
        .createAdmin()
        .accounts(accounts)
        .instruction();

      return ix;
    },

    getPDA: () => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("admin")],
        sdk.programId,
      );
    },
  };
};
