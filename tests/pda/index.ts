import { web3 } from "@coral-xyz/anchor";
import { PROGRAM_ID } from "../utils";
import { BN } from "bn.js";

export const getProjectPDA = (createKey: web3.PublicKey) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from("project"), createKey.toBuffer()],
    PROGRAM_ID
  );
};
