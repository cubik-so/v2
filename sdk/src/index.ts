import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor';
import { Cubik as CubikIDLType } from './types';
import { idl } from './constants';
import { User } from './instructions/user';
import { Project } from './instructions/project';

export class CubikSDK {
  readonly program: Program<CubikIDLType>;
  readonly provider: AnchorProvider;
  public programId: web3.PublicKey;

  constructor(
    wallet: Wallet,
    programId: web3.PublicKey,
    connection: web3.Connection,
    opts: web3.ConfirmOptions
  ) {
    this.provider = new AnchorProvider(connection, wallet, opts);
    this.programId = programId;
    this.program = new Program(
      idl,
      this.programId,
      this.provider
    ) as Program<CubikIDLType>;
  }
  ix = {
    user: new User(this),
    project: new Project(this),
  };
}
