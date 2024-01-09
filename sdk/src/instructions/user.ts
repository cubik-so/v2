import { web3 } from '@coral-xyz/anchor';
import { CubikSDK } from '../index';
import { CreateUserAccounts, CreateUserArgs } from '../types';

export class User {
  readonly cubik: CubikSDK;
  constructor(cubik_sdk: CubikSDK) {
    this.cubik = cubik_sdk;
  }
  getPDA() {
    const userPubkey = this.cubik.provider.wallet.publicKey;
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from('user'), userPubkey.toBuffer()],
      this.cubik.programId
    );
  }
  create(args: CreateUserArgs, accounts: CreateUserAccounts) {
    return this.cubik.program.methods
      .createUser(args.username)
      .accounts(accounts)
      .instruction();
  }
}
