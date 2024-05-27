import { generateKeypair, adminKeypair } from "../../utils";
import { web3 } from "@coral-xyz/anchor";

describe("Project", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Project Creation", () => {});
  describe("Project Updation", () => {});
  describe("Project Close", () => {});
  describe("Project Transfer", () => {});
  describe("Project Tip", () => {});
});
