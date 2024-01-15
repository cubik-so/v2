import { AnchorProvider, BN, Program, Wallet, web3 } from "@coral-xyz/anchor";
import {
  AddMemberSponsorArgs,
  CloseSubAdminContext,
  CreateAdminAccounts,
  CreateProjectAccounts,
  CreateProjectArgs,
  CreateSubAdminContext,
  CreateSubAdminHandlerArgs,
  CreateUserAccounts,
  CreateUserArgs,
  Cubik as CubikIDLType,
  InitSponsorAccounts,
  InitSponsorArgs,
  ProjectStatusHandlerArgs,
  SponsorTeamAccounts,
  TransferProjectAccounts,
  UpdateProjectStatusAccounts,
  UpdateSponsorAccounts,
  UpdateSponsorArgs,
  CreateEventHandlerArgs,
  CreateEventAccounts,
  CreateEventJoinHandlerArgs,
  CreateEventJoinAccounts,
  UpdateEventArgs,
  UpdateEventAccounts,
  InviteEventJoinAccounts,
  CreateContributionArgs,
  CreateContributionAccounts,
} from "./types";
import { idl } from "./constants";
export * from "./types";
export class CubikSDK {
  readonly program: Program<CubikIDLType>;
  readonly provider: AnchorProvider;
  public programId: web3.PublicKey;

  constructor(
    wallet: Wallet,
    programId: web3.PublicKey,
    connection: web3.Connection,
    opts: web3.ConfirmOptions,
  ) {
    this.provider = new AnchorProvider(connection, wallet, opts);
    this.programId = programId;
    this.program = new Program(
      idl,
      this.programId,
      this.provider,
    ) as Program<CubikIDLType>;
  }

  public get user() {
    return {
      create: async (args: CreateUserArgs, accounts: CreateUserAccounts) => {
        const ix = await this.program.methods
          .createUser(args.username)
          .accounts(accounts)
          .instruction();

        return ix;
      },

      getPDA: (userPubkey: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("user"), userPubkey.toBuffer()],
          this.programId,
        );
      },
    };
  }

  public get project() {
    return {
      create: async (
        args: CreateProjectArgs,
        accounts: CreateProjectAccounts,
      ) => {
        const ix = await this.program.methods
          .createProject(
            args.counter,
            args.membersKeys,
            args.threshold,
            args.configAuthority,
            args.timeLock,
            args.memo,
          )
          .accounts(accounts)
          .instruction();

        return ix;
      },

      transfer: async (accounts: TransferProjectAccounts) => {
        const ix = await this.program.methods
          .transferProject()
          .accounts(accounts)
          .instruction();

        return ix;
      },

      updateStatus: async (
        args: ProjectStatusHandlerArgs,
        accounts: UpdateProjectStatusAccounts,
      ) => {
        const ix = await this.program.methods
          .updateProjectStatus(args.status) // @todo: enum issue
          .accounts(accounts)
          .instruction();

        return ix;
      },

      getPDA: (createKey: web3.PublicKey, counter: number) => {
        return web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("project"),
            createKey.toBuffer(),
            new BN(counter).toArrayLike(Buffer, "le", 8),
          ],
          this.programId,
        );
      },
    };
  }

  public get admin() {
    return {
      create: async (accounts: CreateAdminAccounts) => {
        const ix = await this.program.methods
          .createAdmin()
          .accounts(accounts)
          .instruction();

        return ix;
      },

      getPDA: () => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("admin")],
          this.programId,
        );
      },
    };
  }

  public get subAdmin() {
    return {
      create: async (
        args: CreateSubAdminHandlerArgs,
        accounts: CreateSubAdminContext,
      ) => {
        const ix = await this.program.methods
          .createSubAdmin(args.status, args.newSubAdminAuthority)
          .accounts(accounts)
          .instruction();

        return ix;
      },

      close: async (accounts: CloseSubAdminContext) => {
        const ix = await this.program.methods
          .closeSubAdmin()
          .accounts(accounts)
          .instruction();

        return ix;
      },

      getPDA: (subAdmin: web3.PublicKey, createKey: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("admin"), subAdmin.toBuffer(), createKey.toBuffer()],
          this.programId,
        );
      },
    };
  }

  public get sponsor() {
    return {
      init: async (args: InitSponsorArgs, accounts: InitSponsorAccounts) => {
        const ix = await this.program.methods
          .initSponsor(
            args.totalCommitted,
            args.membersKeys,
            args.threshold,
            args.configAuthority,
            args.timeLock,
            args.memo,
          )
          .accounts(accounts)
          .instruction();

        return ix;
      },

      update: async (
        args: UpdateSponsorArgs,
        accounts: UpdateSponsorAccounts,
      ) => {
        const ix = await this.program.methods
          .updateSponsor(args.totalCommitted)
          .accounts(accounts)
          .instruction();

        return ix;
      },

      addMember: async (
        args: AddMemberSponsorArgs,
        accounts: SponsorTeamAccounts,
      ) => {
        const ix = await this.program.methods
          .addMemberSponsor(args.teamMemberKey)
          .accounts(accounts)
          .instruction();

        return ix;
      },

      getPDA: (createKey: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("sponsor"), createKey.toBuffer()],
          this.programId,
        );
      },

      getTeamPDA: (createKey: web3.PublicKey, authority: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("sponsor"), createKey.toBuffer(), authority.toBuffer()],
          this.programId,
        );
      },
    };
  }

  public get event() {
    return {
      create: async (
        args: CreateEventHandlerArgs,
        accounts: CreateEventAccounts,
      ) => {
        const ix = await this.program.methods
          .createEvent(args.matchingPool)
          .accounts(accounts)
          .instruction();

        return ix;
      },

      createEventJoin: async (
        args: CreateEventJoinHandlerArgs,
        accounts: CreateEventJoinAccounts,
      ) => {
        const ix = await this.program.methods
          .createEventJoin(args.counter, args.eventKey)
          .accounts(accounts)
          .instruction();

        return ix;
      },

      update: async (args: UpdateEventArgs, accounts: UpdateEventAccounts) => {
        const ix = await this.program.methods
          .updateEvent(args.matchingPool)
          .accounts(accounts)
          .instruction();
        return ix;
      },

      inviteEventJoin: async (accounts: InviteEventJoinAccounts) => {
        const ix = await this.program.methods
          .inviteEventJoin()
          .accounts(accounts)
          .instruction();
        return ix;
      },

      getPDA: (eventKey: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("event"), eventKey.toBuffer()],
          this.programId,
        );
      },

      getEventJoinPDA: (
        eventAccount: web3.PublicKey,
        projectAccount: web3.PublicKey,
      ) => {
        return web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from("event_join"),
            eventAccount.toBuffer(),
            projectAccount.toBuffer(),
          ],
          this.programId,
        );
      },
    };
  }

  public get contribution() {
    return {
      create: async (
        args: CreateContributionArgs,
        accounts: CreateContributionAccounts,
      ) => {
        const ix = await this.program.methods
          .createContribution(args.amount, args.split, args.createKey)
          .accounts(accounts)
          .instruction();

        return ix;
      },
    };
  }
}
