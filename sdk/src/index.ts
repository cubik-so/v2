import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
import {
  AddMemberSponsorArgs,
  CloseSubAdminContext,
  CreateAdminAccounts,
  CreateAdminSigners,
  CreateProjectAccounts,
  CreateProjectArgs,
  CreateProjectSigners,
  CreateSubAdminContext,
  CreateSubAdminHandlerArgs,
  CreateUserAccounts,
  CreateUserArgs,
  Cubik as CubikIDLType,
  InitSponsorAccounts,
  InitSponsorArgs,
  InitSponsorSigners,
  ProjectStatusHandlerArgs,
  SponsorTeamAccounts,
  SponsorTeamSigners,
  TransferProjectAccounts,
  TransferProjectSigners,
  UpdateProjectStatusAccounts,
  UpdateProjectStatusSigners,
  UpdateSponsorAccounts,
  UpdateSponsorArgs,
  UpdateSponsorSigners,
  CreateEventHandlerArgs,
  CreateEventAccounts,
  CreateEventSigners,
  CreateEventJoinHandlerArgs,
  CreateEventJoinAccounts,
  CreateEventJoinSigners,
  UpdateEventArgs,
  UpdateEventAccounts,
  UpdateEventSigners,
  InviteEventJoinAccounts,
  InviteEventJoinSigners,
  CreateContributionArgs,
  CreateContributionAccounts,
  CreateContributionSigners,
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
        signers: CreateProjectSigners,
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
          .signers(signers)
          .instruction();

        return ix;
      },

      transfer: async (
        accounts: TransferProjectAccounts,
        signers: TransferProjectSigners,
      ) => {
        const ix = await this.program.methods
          .transferProject()
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },

      updateStatus: async (
        args: ProjectStatusHandlerArgs,
        accounts: UpdateProjectStatusAccounts,
        signers: UpdateProjectStatusSigners,
      ) => {
        const ix = await this.program.methods
          .updateProjectStatus(args.status) // @todo: enum issue
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },

      // @todo: figure out pdas
      getPDA: (projectPubkey: web3.PublicKey) => {
        return web3.PublicKey.findProgramAddressSync(
          [Buffer.from("project"), projectPubkey.toBuffer()],
          this.programId,
        );
      },
    };
  }

  public get admin() {
    return {
      create: async (
        accounts: CreateAdminAccounts,
        signers: CreateAdminSigners,
      ) => {
        const ix = await this.program.methods
          .createAdmin()
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
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
    };
  }

  public get sponsor() {
    return {
      init: async (
        args: InitSponsorArgs,
        accounts: InitSponsorAccounts,
        signers: InitSponsorSigners,
      ) => {
        const ix = await this.program.methods
          .initSponsor(args.vault, args.totalCommitted)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },

      update: async (
        args: UpdateSponsorArgs,
        accounts: UpdateSponsorAccounts,
        signers: UpdateSponsorSigners,
      ) => {
        const ix = await this.program.methods
          .updateSponsor(args.totalCommitted)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },

      addMember: async (
        args: AddMemberSponsorArgs,
        accounts: SponsorTeamAccounts,
        signers: SponsorTeamSigners,
      ) => {
        const ix = await this.program.methods
          .addMemberSponsor(args.teamMemberKey)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },
    };
  }

  public get event() {
    return {
      create: async (
        args: CreateEventHandlerArgs,
        accounts: CreateEventAccounts,
        signers: CreateEventSigners,
      ) => {
        const ix = await this.program.methods
          .createEvent(args.matchingPool)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },

      createEventJoin: async (
        args: CreateEventJoinHandlerArgs,
        accounts: CreateEventJoinAccounts,
        signers: CreateEventJoinSigners,
      ) => {
        const ix = await this.program.methods
          .createEventJoin(args.counter, args.eventKey)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },

      update: async (
        args: UpdateEventArgs,
        accounts: UpdateEventAccounts,
        signers: UpdateEventSigners,
      ) => {
        const ix = await this.program.methods
          .updateEvent(args.matchingPool)
          .accounts(accounts)
          .signers(signers)
          .instruction();
        return ix;
      },

      inviteEventJoin: async (
        accounts: InviteEventJoinAccounts,
        signers: InviteEventJoinSigners,
      ) => {
        const ix = await this.program.methods
          .inviteEventJoin()
          .accounts(accounts)
          .signers(signers)
          .instruction();
        return ix;
      },
    };
  }

  public get contribution() {
    return {
      create: async (
        args: CreateContributionArgs,
        accounts: CreateContributionAccounts,
        signers: CreateContributionSigners,
      ) => {
        const ix = await this.program.methods
          .createContribution(args.amount, args.split, args.createKey)
          .accounts(accounts)
          .signers(signers)
          .instruction();

        return ix;
      },
    };
  }
}
