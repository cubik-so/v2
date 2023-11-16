/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * @category Instructions
 * @category CreateProject
 * @category generated
 */
export type CreateProjectInstructionArgs = {
  counter: beet.bignum
  multiSig: web3.PublicKey
  metadata: string
}
/**
 * @category Instructions
 * @category CreateProject
 * @category generated
 */
export const createProjectStruct = new beet.FixableBeetArgsStruct<
  CreateProjectInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['counter', beet.u64],
    ['multiSig', beetSolana.publicKey],
    ['metadata', beet.utf8String],
  ],
  'CreateProjectInstructionArgs'
)
/**
 * Accounts required by the _createProject_ instruction
 *
 * @property [_writable_, **signer**] owners
 * @property [_writable_] projectAccount
 * @property [_writable_] adminAccount
 * @property [_writable_] userAccount
 * @category Instructions
 * @category CreateProject
 * @category generated
 */
export type CreateProjectInstructionAccounts = {
  owners: web3.PublicKey
  projectAccount: web3.PublicKey
  adminAccount: web3.PublicKey
  userAccount: web3.PublicKey
  systemProgram?: web3.PublicKey
  rent?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createProjectInstructionDiscriminator = [
  148, 219, 181, 42, 221, 114, 145, 190,
]

/**
 * Creates a _CreateProject_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateProject
 * @category generated
 */
export function createCreateProjectInstruction(
  accounts: CreateProjectInstructionAccounts,
  args: CreateProjectInstructionArgs,
  programId = new web3.PublicKey('3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS')
) {
  const [data] = createProjectStruct.serialize({
    instructionDiscriminator: createProjectInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.owners,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.projectAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.adminAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.userAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
