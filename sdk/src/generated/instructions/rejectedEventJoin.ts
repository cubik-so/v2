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
 * @category RejectedEventJoin
 * @category generated
 */
export type RejectedEventJoinInstructionArgs = {
  counter: beet.bignum
  eventKey: web3.PublicKey
  owner: web3.PublicKey
}
/**
 * @category Instructions
 * @category RejectedEventJoin
 * @category generated
 */
export const rejectedEventJoinStruct = new beet.BeetArgsStruct<
  RejectedEventJoinInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['counter', beet.u64],
    ['eventKey', beetSolana.publicKey],
    ['owner', beetSolana.publicKey],
  ],
  'RejectedEventJoinInstructionArgs'
)
/**
 * Accounts required by the _rejectedEventJoin_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] adminAccount
 * @property [_writable_] eventJoinAccount
 * @property [_writable_] eventAccount
 * @property [_writable_] projectAccount
 * @category Instructions
 * @category RejectedEventJoin
 * @category generated
 */
export type RejectedEventJoinInstructionAccounts = {
  authority: web3.PublicKey
  adminAccount: web3.PublicKey
  eventJoinAccount: web3.PublicKey
  eventAccount: web3.PublicKey
  projectAccount: web3.PublicKey
  systemProgram?: web3.PublicKey
  rent?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const rejectedEventJoinInstructionDiscriminator = [
  22, 154, 10, 195, 53, 170, 42, 174,
]

/**
 * Creates a _RejectedEventJoin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category RejectedEventJoin
 * @category generated
 */
export function createRejectedEventJoinInstruction(
  accounts: RejectedEventJoinInstructionAccounts,
  args: RejectedEventJoinInstructionArgs,
  programId = new web3.PublicKey('3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS')
) {
  const [data] = rejectedEventJoinStruct.serialize({
    instructionDiscriminator: rejectedEventJoinInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.adminAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.eventJoinAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.eventAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.projectAccount,
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
