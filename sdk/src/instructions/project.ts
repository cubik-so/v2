import { BN, web3 } from '@coral-xyz/anchor';
import { CubikSDK } from '..';
import {
  CreateProjectAccounts,
  CreateProjectArgs,
  ProjectStatusHandlerArgs,
  TransferProjectAccounts,
  UpdateProjectStatusAccounts,
} from '../types';

export const project = (sdk: CubikSDK) => {
  return {
    create: async (
      args: CreateProjectArgs,
      accounts: CreateProjectAccounts
    ) => {
      const ix = await sdk.program.methods
        .createProject(
          args.counter,
          args.membersKeys,
          args.threshold,
          args.configAuthority,
          args.timeLock,
          args.memo,
          args.rentCollector
        )
        .accounts(accounts)
        .instruction();

      return ix;
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
        .updateProjectStatus(args.status) // @todo: enum issue
        .accounts(accounts)
        .instruction();

      return ix;
    },

    get: async (pda: web3.PublicKey) => {
      return await sdk.program.account.project.fetch(pda);
    },

    getPDA: (createKey: web3.PublicKey, counter: number) => {
      return web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('project'),
          createKey.toBuffer(),
          new BN(counter).toArrayLike(Buffer, 'le', 8),
        ],
        sdk.programId
      );
    },
  };
};
