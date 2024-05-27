import { web3 } from "@coral-xyz/anchor";
import {
  PROGRAM_ID,
  SEED_MULTISIG,
  SEED_PREFIX,
  SQUADS_PROGRAM_ID,
} from "../utils";
import { BN } from "bn.js";

export const getProjectPDA = (createKey: web3.PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from("project"), createKey.toBuffer()],
    PROGRAM_ID
  );
};

export const getMultisigPDA = (createKey: web3.PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [SEED_PREFIX, SEED_MULTISIG, createKey.toBytes()],
    SQUADS_PROGRAM_ID
  );
};

export const getEventPDA = (createKey: web3.PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from("event"), createKey.toBuffer()],
    PROGRAM_ID
  );
};

export const getEventTeamPDA = (
  eventAccount: web3.PublicKey,
  authority: web3.PublicKey
) => {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("event"),
      eventAccount.toBuffer(),
      Buffer.from("team"),
      authority.toBuffer(),
    ],
    PROGRAM_ID
  );
};

export const getEventParticipantPDA = (
  eventAccount: web3.PublicKey,
  projectAccount: web3.PublicKey
) => {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("eventParticipant"),
      eventAccount.toBuffer(),
      projectAccount.toBuffer(),
    ],
    PROGRAM_ID
  );
};

export const getTeamPDA = (createKey: web3.PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from("team"), createKey.toBuffer()],
    PROGRAM_ID
  );
};
