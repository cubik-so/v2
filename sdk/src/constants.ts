import * as anchor from '@coral-xyz/anchor';
import { web3 } from '@coral-xyz/anchor';
import { Cubik } from './types';

/**
 * Program IDL
 *
 * @category constants
 */
import IDL from '../../target/idl/cubik.json';
export const idl = IDL as anchor.Idl;

/**
 * Cubik Program
 *
 * @category constants
 */
export const createCubikProgram = (
  programId: string
): anchor.Program<Cubik> => {
  return new anchor.Program(
    idl,
    new web3.PublicKey(programId)
  ) as unknown as anchor.Program<Cubik>;
};
