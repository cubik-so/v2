import { web3 } from "@coral-xyz/anchor";
import { CubikSDK } from "../index";
import {
  CreateUserAccounts,
  CreateUserArgs,
  CreateUserSigners,
} from "../types";

export class User {
  readonly cubik: CubikSDK;
  constructor(cubik_sdk: CubikSDK) {
    this.cubik = cubik_sdk;
  }
  public get user() {
    return {
      create: async (
        args: CreateUserArgs,
        accounts: CreateUserAccounts,
        signers: CreateUserSigners,
      ) => {
        const ix = await this.cubik.program.methods
          .createUser(args.username)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },
    };
  }

  getPDA(userPubkey: web3.PublicKey) {
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userPubkey.toBuffer()],
      this.cubik.programId,
    );
  }
}
