/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from "@solana/web3.js";
import * as beet from "@metaplex-foundation/beet";
import * as beetSolana from "@metaplex-foundation/beet-solana";

/**
 * @category Instructions
 * @category CreateEvent
 * @category generated
 */
export type CreateEventInstructionArgs = {
  eventKey: web3.PublicKey;
  matchingPool: beet.bignum;
  metadata: string;
};
/**
 * @category Instructions
 * @category CreateEvent
 * @category generated
 */
export const createEventStruct = new beet.FixableBeetArgsStruct<
  CreateEventInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["eventKey", beetSolana.publicKey],
    ["matchingPool", beet.u64],
    ["metadata", beet.utf8String],
  ],
  "CreateEventInstructionArgs"
);
/**
 * Accounts required by the _createEvent_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] eventAccount
 * @category Instructions
 * @category CreateEvent
 * @category generated
 */
export type CreateEventInstructionAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const createEventInstructionDiscriminator = [
  49, 219, 29, 203, 22, 98, 100, 87,
];

/**
 * Creates a _CreateEvent_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateEvent
 * @category generated
 */
export function createCreateEventInstruction(
  accounts: CreateEventInstructionAccounts,
  args: CreateEventInstructionArgs,
  programId = new web3.PublicKey("3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS")
) {
  const [data] = createEventStruct.serialize({
    instructionDiscriminator: createEventInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
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
