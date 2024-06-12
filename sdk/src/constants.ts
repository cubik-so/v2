import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import { Cubik, IDL } from "./types";

/**
 * Program IDL
 *
 * @category constants
 */
export const idl = IDL;

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

export const PROJECT_PREFIX = Buffer.from("project");
export const EVENT_PREFIX = Buffer.from("event");
export const TEAM_PREFIX = Buffer.from("team");
export const EVENT_PARTICIPANT_PREFIX = Buffer.from("eventparticipant");
export const SPONSOR_PREFIX = Buffer.from("sponsor");
