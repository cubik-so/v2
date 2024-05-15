import { web3 } from "@coral-xyz/anchor";
import { CubikSDK } from "..";
import { PROJECT_PREFIX } from "../constants";
import {
  CreateProjectAccounts,
  CreateProjectArgs,
  ProjectStatusHandlerArgs,
  TransferProjectAccounts,
  UpdateProjectStatusAccounts,
} from "../types";

export const project = (sdk: CubikSDK) => {
  return {
    create: async (
      accounts: CreateProjectAccounts,
      args: CreateProjectArgs
    ) => {
      return await sdk.program.methods
        .projectCreate(args)
        .accounts(accounts)
        .instruction();
    },

    transfer: async (accounts: TransferProjectAccounts) => {
      const ix = await sdk.program.methods
        .transferProject()
        .accounts(accounts)
        .instruction();

      return ix;
    },

    updateStatus: async (
      args: ProjectStatusHandlerArgs,
      accounts: UpdateProjectStatusAccounts
    ) => {
      const ix = await sdk.program.methods
        .updateProjectStatus(args.status)
        .accounts(accounts)
        .instruction();

      return ix;
    },

    get: async (pda: web3.PublicKey) => {
      return await sdk.program.account.project.fetch(pda);
    },

    getPDA: (createKey: web3.PublicKey) => {
      return web3.PublicKey.findProgramAddressSync(
        [PROJECT_PREFIX, createKey.toBuffer()],
        sdk.programId
      );
    },
  };
};
