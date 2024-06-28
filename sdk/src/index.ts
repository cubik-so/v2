import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import { Cubik as CubikIDLType } from "./types";
import { idl } from "./constants";
import { project } from "./instructions/project";
import { sponsor } from "./instructions/sponsor";
import { event } from "./instructions/event";
import { contribution } from "./instructions/contribution";
export * from "./types";

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

  public get project() {
    return project(this);
  }

  public get sponsor() {
    return sponsor(this);
  }

  public get event() {
    return event(this);
  }

  public get contribution() {
    return contribution(this);
  }
}
