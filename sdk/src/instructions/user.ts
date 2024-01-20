import { web3 } from "@coral-xyz/anchor";
import { CreateUserAccounts, CreateUserArgs } from "../types";
import { CubikSDK } from "..";

export const user = (sdk: CubikSDK) => {
  return {
    create: async (args: CreateUserArgs, accounts: CreateUserAccounts) => {
      const ix = await sdk.program.methods
        .createUser(args.username)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    getPDA: (userPubkey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user"), userPubkey.toBuffer()],
        sdk.programId,
      );
    },
  };
};
