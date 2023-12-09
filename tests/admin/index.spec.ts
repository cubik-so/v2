import * as anchor from "@coral-xyz/anchor";
import {
  adminKeypair,
  adminPDA,
  program,
  getProvider,
  subAdminPDA,
} from "../utils";
import { expect } from "chai";

describe("Admin", async () => {
  const provider = getProvider(adminKeypair);

  let createKey = anchor.web3.Keypair.generate();
  let eventKey = anchor.web3.Keypair.generate();

  let [newSubAdminPDA, __] = anchor.web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("admin"), createKey.publicKey.toBuffer()],
    program.programId,
  );

  let [newEventSubAdminPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("admin"),
      createKey.publicKey.toBuffer(),
      eventKey.publicKey.toBuffer(),
    ],
    program.programId,
  );

  describe("createAdmin", () => {
    it("should create an admin", async () => {
      const ix = await program.methods
        .createAdmin()
        .accounts({
          authority: adminKeypair.publicKey,
          adminAccount: adminPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([adminKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = adminKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const admin = await program.account.admin.fetch(adminPDA);

      expect(admin.authority).to.eql(adminKeypair.publicKey);
    });

    it("should set a sub admin with project status permissions", async () => {
      const ix = await program.methods
        .setSubAdminProjectStatusPermissions(
          createKey.publicKey,
          eventKey.publicKey,
        )
        .accounts({
          authority: adminKeypair.publicKey,
          subAdminAccount: subAdminPDA,
          newSubAdminAccount: newSubAdminPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([adminKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = adminKeypair.publicKey;

      await provider.sendAndConfirm(tx);
    });

    it("should set a sub admin with event permissions", async () => {
      const ix = await program.methods
        .setSubAdminEventPermissions(createKey.publicKey, eventKey.publicKey, {
          full: true,
          projectStatus: true,
          eventJoinStatus: true,
        })
        .accounts({
          authority: adminKeypair.publicKey,
          subAdminAccount: subAdminPDA,
          newSubAdminAccount: newEventSubAdminPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([adminKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = adminKeypair.publicKey;

      await provider.sendAndConfirm(tx);
    });
  });
});
