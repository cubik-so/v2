/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import {
  RoundProjectStatus,
  roundProjectStatusBeet,
} from '../types/RoundProjectStatus'

/**
 * Arguments used to create {@link EventJoin}
 * @category Accounts
 * @category generated
 */
export type EventJoinArgs = {
  authority: web3.PublicKey
  status: RoundProjectStatus
  donation: beet.bignum
  bump: number
}

export const eventJoinDiscriminator = [38, 238, 50, 133, 221, 124, 13, 106]
/**
 * Holds the data for the {@link EventJoin} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class EventJoin implements EventJoinArgs {
  private constructor(
    readonly authority: web3.PublicKey,
    readonly status: RoundProjectStatus,
    readonly donation: beet.bignum,
    readonly bump: number
  ) {}

  /**
   * Creates a {@link EventJoin} instance from the provided args.
   */
  static fromArgs(args: EventJoinArgs) {
    return new EventJoin(args.authority, args.status, args.donation, args.bump)
  }

  /**
   * Deserializes the {@link EventJoin} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [EventJoin, number] {
    return EventJoin.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link EventJoin} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<EventJoin> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find EventJoin account at ${address}`)
    }
    return EventJoin.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      '3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, eventJoinBeet)
  }

  /**
   * Deserializes the {@link EventJoin} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [EventJoin, number] {
    return eventJoinBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link EventJoin} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return eventJoinBeet.serialize({
      accountDiscriminator: eventJoinDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link EventJoin}
   */
  static get byteSize() {
    return eventJoinBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link EventJoin} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      EventJoin.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link EventJoin} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === EventJoin.byteSize
  }

  /**
   * Returns a readable version of {@link EventJoin} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      authority: this.authority.toBase58(),
      status: 'RoundProjectStatus.' + RoundProjectStatus[this.status],
      donation: (() => {
        const x = <{ toNumber: () => number }>this.donation
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      bump: this.bump,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const eventJoinBeet = new beet.BeetStruct<
  EventJoin,
  EventJoinArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['authority', beetSolana.publicKey],
    ['status', roundProjectStatusBeet],
    ['donation', beet.u128],
    ['bump', beet.u8],
  ],
  EventJoin.fromArgs,
  'EventJoin'
)
