/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import * as beetSolana from "@metaplex-foundation/beet-solana";

/**
 * @category Instructions
 * @category ApproveEventJoin
 * @category generated
 */
export type ApproveEventJoinInstructionArgs = {
  counter: beet.bignum;
  eventKey: web3.PublicKey;
  owner: web3.PublicKey;
};
/**
 * @category Instructions
 * @category ApproveEventJoin
 * @category generated
 */
export const approveEventJoinStruct = new beet.BeetArgsStruct<
  ApproveEventJoinInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["counter", beet.u64],
    ["eventKey", beetSolana.publicKey],
    ["owner", beetSolana.publicKey],
  ],
  "ApproveEventJoinInstructionArgs"
);
/**
 * Accounts required by the _approveEventJoin_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] adminAccount
 * @property [_writable_] eventJoinAccount
 * @property [_writable_] eventAccount
 * @property [_writable_] projectAccount
 * @category Instructions
 * @category ApproveEventJoin
 * @category generated
 */
export type ApproveEventJoinInstructionAccounts = {
  authority: web3.PublicKey;
  adminAccount: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const approveEventJoinInstructionDiscriminator = [
  58, 26, 21, 108, 201, 147, 109, 96,
];

/**
 * Creates a _ApproveEventJoin_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ApproveEventJoin
 * @category generated
 */
export function createApproveEventJoinInstruction(
  accounts: ApproveEventJoinInstructionAccounts,
  args: ApproveEventJoinInstructionArgs,
  programId = new web3.PublicKey("3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS")
) {
  const [data] = approveEventJoinStruct.serialize({
    instructionDiscriminator: approveEventJoinInstructionDiscriminator,
    ...args,
  });
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
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
