import * as web3 from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export type CreateEventArgs = {
  matchingPool: BN;
  metadata: number[];
};

export type CreateEventAccounts = {
  authority: web3.PublicKey;
  createKey: web3.PublicKey;
  eventKey: web3.PublicKey;
  eventAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  userAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type CreateEventSigners = web3.Keypair[];

export type CreateEventJoinArgs = {
  counter: BN;
  eventKey: web3.PublicKey;
};

export type CreateEventJoinAccounts = {
  authority: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type CreateEventJoinSigners = web3.Keypair[];

export enum EventProjectStatus {
  PendingApproval = 0,
  Approved = 1,
  Rejected = 2,
}

export type UpdateEventStatusArgs = {
  status: EventProjectStatus; // Enum or type representing EventProjectStatus
};

export type UpdateEventStatusAccounts = {
  authority: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type UpdateEventStatusSigners = web3.Keypair[];

export type UpdateEventArgs = {
  matchingPool: BN;
  metadata: number[];
};

export type UpdateEventAccounts = {
  authority: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type UpdateEventSigners = web3.Keypair[];

export type InviteEventJoinArgs = {}; // No explicit args in this case

export type InviteEventJoinAccounts = {
  authority: web3.PublicKey;
  eventJoinAccount: web3.PublicKey;
  subAdminAccount: web3.PublicKey;
  projectAccount: web3.PublicKey;
  eventAccount: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rent: web3.PublicKey;
};

export type InviteEventJoinSigners = web3.Keypair[];
