import { Wallet, web3 } from "@coral-xyz/anchor";
import {
  PROGRAM_ID,
  adminPair,
  createCubikProgram,
  createLocalhostConnection,
  generateFundedKeypair,
  generateKeypair,
} from "../../utils";
import { getAdminPDA, getAdminSubAdminPDA } from "../../pda";

describe("SubAdmin", () => {
  const admin = adminPair();
  const adminCreateKey = new web3.PublicKey(
    "9ykrLmqn4NKNuBRiWdHaCQ6rF2hFvXYKdbkphPMDZXPh",
  );
  const connection = createLocalhostConnection();
  let newSubAdmin: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    newSubAdmin = await generateFundedKeypair(connection);
    // admin = await generateFundedKeypair(connection);
  });
  it("SubAdmin level 3", async () => {
    const wallet = new Wallet(admin);
    const program = createCubikProgram(wallet);
    const tx = await program.methods
      .createSubAdmin(admin.publicKey, 3)
      .accounts({
        authority: admin.publicKey,
        adminAccount: getAdminPDA()[0],
        subAdminAccount: getAdminSubAdminPDA(
          admin.publicKey,
          createKey.publicKey,
        )[0],
        createKey: createKey.publicKey,
      })
      .signers([createKey])
      .rpc();
    console.log(createKey.publicKey.toBase58());

    console.log(tx);
  });
  it("SubAdmin Create - level 1", async () => {
    const wallet = new Wallet(admin);

    const program = createCubikProgram(wallet);
    const tx = await program.methods
      .createSubAdmin(newSubAdmin.publicKey, 1)
      .accounts({
        authority: admin.publicKey,
        adminAccount: getAdminPDA()[0],
        subAdminAccount: getAdminSubAdminPDA(
          newSubAdmin.publicKey,
          createKey.publicKey,
        )[0],
        createKey: createKey.publicKey,
      })
      .signers([createKey])
      .rpc();
    console.log(tx);
  });

  describe("Add Event", () => {
    it("Success: Add Event", async () => {
      const wallet = new Wallet(admin);

      const program = createCubikProgram(wallet);

      const tx = await program.methods
        .addEventAccess(generateKeypair().publicKey)
        .accounts({
          authority: admin.publicKey,
          signerSubAdminAccount: getAdminSubAdminPDA(
            admin.publicKey,
            adminCreateKey,
          )[0],
          subAdminAccount: getAdminSubAdminPDA(
            newSubAdmin.publicKey,
            createKey.publicKey,
          )[0],
        })
        .rpc();
      console.log(tx);
    });

    after(async () => {
      const wallet = new Wallet(admin);

      const program = createCubikProgram(wallet);

      const subAdminAccount = await program.account.subAdmin.fetch(
        getAdminSubAdminPDA(newSubAdmin.publicKey, createKey.publicKey)[0],
      );
      console.log(subAdminAccount);
    });
  });
  describe.skip("Remove Event", () => {
    it("Error: Remove Event", async () => {
      const wallet = new Wallet(newSubAdmin);

      const program = createCubikProgram(wallet);

      const tx = await program.methods
        .removeEventAccess(generateKeypair().publicKey)
        .accounts({
          authority: newSubAdmin.publicKey,
          signerSubAdminAccount: getAdminSubAdminPDA(
            newSubAdmin.publicKey,
            createKey.publicKey,
          )[0],
          subAdminAccount: getAdminSubAdminPDA(
            newSubAdmin.publicKey,
            createKey.publicKey,
          )[0],
        })
        .rpc();
      console.log(tx);
    });
    it("Success: Remove Event", async () => {
      const wallet = new Wallet(admin);

      const program = createCubikProgram(wallet);

      const tx = await program.methods
        .removeEventAccess(generateKeypair().publicKey)
        .accounts({
          authority: admin.publicKey,
          signerSubAdminAccount: getAdminSubAdminPDA(
            admin.publicKey,
            adminCreateKey,
          )[0],
          subAdminAccount: getAdminSubAdminPDA(
            newSubAdmin.publicKey,
            createKey.publicKey,
          )[0],
        })
        .rpc();
      console.log(tx);
    });
    after(async () => {
      const wallet = new Wallet(newSubAdmin);

      const program = createCubikProgram(wallet);

      const subAdminAccount = await program.account.subAdmin.fetch(
        getAdminSubAdminPDA(newSubAdmin.publicKey, createKey.publicKey)[0],
      );
      console.log(subAdminAccount);
    });
  });
  it.skip("Close SubAdmin", async () => {
    const wallet = new Wallet(admin);

    const program = createCubikProgram(wallet);

    const tx = await program.methods
      .closeSubAdmin()
      .accounts({
        authority: admin.publicKey,
        closeSubAdminAccount: getAdminSubAdminPDA(
          newSubAdmin.publicKey,
          createKey.publicKey,
        )[0],
        subAdminAccount: getAdminSubAdminPDA(
          admin.publicKey,
          adminCreateKey,
        )[0],
      })
      .rpc();
    console.log(tx);
  });
});
