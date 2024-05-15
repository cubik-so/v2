import { web3 } from "@coral-xyz/anchor";
import { CubikSDK } from "..";
import { PROJECT_PREFIX } from "../constants";
import {
  CreateProjectAccounts,
  CreateProjectArgs,
  TransferProjectAccounts,
  TransferProjectArgs,
  UpdateProjectAccounts,
  ProjectUpdateArgs,
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

    transfer: async (accounts: TransferProjectAccounts, args: TransferProjectArgs) => {
      return await sdk.program.methods
        .projectTransfer(args)
        .accounts(accounts)
        .instruction();
    },

    update: async (
      accounts: UpdateProjectAccounts,
      args: ProjectUpdateArgs
    ) => {
      return await sdk.program.methods
        .projectUpdate(args)
        .accounts(accounts)
        .instruction();
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
