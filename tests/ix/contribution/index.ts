import { generateKeypair, adminKeypair } from "../../utils";
import { web3 } from "@coral-xyz/anchor";

describe("Contribution", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Contribution SPL", () => {});
  describe("Contribution SOL", () => {});
});
