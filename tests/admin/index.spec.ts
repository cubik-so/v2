import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { adminKeypair, adminPDA, program, getProvider } from "../utils";
import { expect } from "chai";

describe("Admin", async () => {
  const provider = getProvider(adminKeypair);
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

    // it("should create a sub admin with full permission", async () => {
    //   const ix = await program.methods
    //     .createAdmin()
    //     .accounts({
    //       authority: adminKeypair.publicKey,
    //       adminAccount: adminPDA,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //     })
    //     .signers([adminKeypair])
    //     .instruction();

    //   const tx = new anchor.web3.Transaction().add(ix);

    //   tx.recentBlockhash = (
    //     await provider.connection.getLatestBlockhash()
    //   ).blockhash;

    //   tx.feePayer = adminKeypair.publicKey;

    //   await provider.sendAndConfirm(tx);

    //   const admin = await program.account.admin.fetch(adminPDA);

    //   expect(admin.authority).to.eql(adminKeypair.publicKey);
    // });
  });
});
