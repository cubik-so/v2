import { generateKeypair, adminKeypair } from "../../utils";
import { web3 } from "@coral-xyz/anchor";

describe("Event", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Event Creation", () => {});
  describe("Event Updation", () => {});
  describe("Event Team Creation", () => {});
  describe("Event Team Close", () => {});
  describe("Event Participant Create", () => {});
  describe("Event Participant Update", () => {});
  describe("Event Participant Invite", () => {});
});
