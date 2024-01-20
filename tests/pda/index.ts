import { web3 } from '@coral-xyz/anchor';
import { PROGRAM_ID } from '../utils';
import { BN } from 'bn.js';

export const getUserPDA = (wallet: web3.PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from('user'), wallet.toBuffer()],
    PROGRAM_ID
  );
};
export const getProjectPDA = (createKey: web3.PublicKey, counter: number) => {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from('project'),
      createKey.toBuffer(),
      new BN(counter).toArrayLike(Buffer, 'le', 8),
    ],
    PROGRAM_ID
  );
};

export const getAdminPDA = () => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from('admin')],
    PROGRAM_ID
  );
};
export const getAdminSubAdminPDA = (
  authority: web3.PublicKey,
  createKey: web3.PublicKey
) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from('admin'), authority.toBuffer(), createKey.toBuffer()],
    PROGRAM_ID
  );
};
