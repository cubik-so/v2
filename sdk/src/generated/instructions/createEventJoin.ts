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
 * @category CreateEventJoin
 * @category generated
 */
export type CreateEventJoinInstructionArgs = {
  counter: beet.bignum
  eventKey: web3.PublicKey
  metadata: string
}
/**
 * @category Instructions
 * @category CreateEventJoin
 * @category generated
 */
export const createEventJoinStruct = new beet.FixableBeetArgsStruct<
  CreateEventJoinInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['counter', beet.u64],
    ['eventKey', beetSolana.publicKey],
    ['metadata', beet.utf8String],
  ],
  'CreateEventJoinInstructionArgs'
)
/**
 * Accounts required by the _createEventJoin_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] eventJoinAccount
 * @property [_writable_] projectAccount
 * @property [_writable_] eventAccount
 * @category Instructions
 * @category CreateEventJoin
 * @category generated
 */
export type CreateEventJoinInstructionAccounts = {
  authority: web3.PublicKey
  eventJoinAccount: web3.PublicKey
  projectAccount: web3.PublicKey
  eventAccount: web3.PublicKey
  systemProgram?: web3.PublicKey
  rent?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createEventJoinInstructionDiscriminator = [
  225, 73, 212, 8, 140, 148, 168, 110,
]

/**
 * Creates a _CreateEventJoin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateEventJoin
 * @category generated
 */
export function createCreateEventJoinInstruction(
  accounts: CreateEventJoinInstructionAccounts,
  args: CreateEventJoinInstructionArgs,
  programId = new web3.PublicKey('3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS')
) {
  const [data] = createEventJoinStruct.serialize({
    instructionDiscriminator: createEventJoinInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.eventJoinAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.projectAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.eventAccount,
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
