import { web3 } from '@coral-xyz/anchor';
import { CubikSDK } from '..';
import {
  CreateAdminAccounts,
  CreateAdminVaultAccounts,
  CreateAdminVaultArgs,
} from '../types';

export const admin = (sdk: CubikSDK) => {
  return {
    create: async (accounts: CreateAdminAccounts) => {
      const ix = await sdk.program.methods
        .createAdmin()
        .accounts(accounts)
        .instruction();

      return ix;
    },
    createAdminVault: async (
      args: CreateAdminVaultArgs,
      accounts: CreateAdminVaultAccounts
    ) => {
      const ix = await sdk.program.methods
        .createAdminVault(args.members, args.memo)
        .accounts(accounts)
        .instruction();
      return ix;
    },
    getAdminVault: async () => {
      const [pda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('admin'), Buffer.from('vault')],
        sdk.programId
      );
      return await sdk.program.account.adminVault.fetch(pda);
    },
    getPDA: () => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from('admin')],
        sdk.programId
      );
    },
    getAdminVaultPDA: () => {
      return web3.PublicKey.findProgramAddressSync(
        [Buffer.from('admin'), Buffer.from('vault')],
        sdk.programId
      );
    },
  };
};
