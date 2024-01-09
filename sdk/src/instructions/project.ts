import { web3, BN } from '@coral-xyz/anchor';
import { CubikSDK } from '../index';
import { CreateProjectAccounts, CreateProjectArgs } from '../types';

export class Project {
  readonly cubik: CubikSDK;
  constructor(cubik_sdk: CubikSDK) {
    this.cubik = cubik_sdk;
  }
  getPDA(create_key: web3.PublicKey, counter: number) {
    const userPubkey = this.cubik.provider.wallet.publicKey;

    return web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('project'),
        userPubkey.toBuffer(),
        create_key.toBuffer(),
        new BN(counter).toArrayLike(Buffer, 'le', 2),
      ],
      this.cubik.programId
    );
  }

  create(args: CreateProjectArgs, accounts: CreateProjectAccounts) {
    return this.cubik.program.methods
      .createProject(
        args.counter,
        args.membersKeys,
        args.threshold,
        args.configAuthority,
        args.timeLock,
        args.memo
      )
      .accounts(accounts)
      .instruction();
  }
}
