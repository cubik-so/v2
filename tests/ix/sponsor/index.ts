import { generateKeypair, adminKeypair } from "../../utils";
import { web3 } from "@coral-xyz/anchor";

describe("Sponsor", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Sponsor Create", () => {});
  describe("Sponsor Create Custody", () => {});
  describe("Sponsor Update", () => {});
  describe("Sponsor close", () => {});
});
