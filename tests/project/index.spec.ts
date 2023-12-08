import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import {
  program,
  getProvider,
  airdrop,
  subAdminKeypair,
  subAdminPDA,
  squadsProgramId,
  userKeypair,
  userPDA,
} from "../utils";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("Project", async () => {
  let provider: anchor.Provider;
  let projectPDA: anchor.web3.PublicKey;
  let counter = new anchor.BN(23);
  let metadata = Keypair.generate().publicKey.toBuffer() as unknown as number[];
  let createKey = Keypair.generate();
  let multisig = Keypair.generate();

  provider = getProvider(userKeypair);

  projectPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("project"),
      createKey.publicKey.toBuffer(),
      counter.toBuffer(),
    ],
    program.programId,
  )[0];

  before(async () => {
    // await airdrop(newUserKeypair);
  });

  describe("createProject", () => {
    it("should create a project", async () => {
      const ix = await program.methods
        .createProject(counter, squadsProgramId, metadata)
        .accounts({
          owner: userKeypair.publicKey,
          createKey: createKey.publicKey,
          projectAccount: projectPDA,
          squadsProgram: squadsProgramId,
          multisig: multisig.publicKey,
          userAccount: userPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([userKeypair, createKey])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = userKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const project = await program.account.project.fetch(projectPDA);

      assert.ok(project.owner.equals(userKeypair.publicKey));
    });

    it("should verify project status", async () => {
      const ix = await program.methods
        .projectStatusVerified()
        .accounts({
          authority: subAdminKeypair.publicKey,
          subAdminAccount: subAdminPDA,
          projectAccount: projectPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([subAdminKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = subAdminKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const project = await program.account.project.fetch(projectPDA);

      assert.ok(
        (project.status.verified as unknown as string).match("Verified"),
      );
    });

    it("should update project metadata", async () => {
      let newMetadata =
        Keypair.generate().publicKey.toBuffer() as unknown as number[];
      const ix = await program.methods
        .updateProject(newMetadata)
        .accounts({
          authority: userKeypair.publicKey,
          projectAccount: projectPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([userKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = userKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const project = await program.account.project.fetch(projectPDA);

      assert.ok(Buffer.from(project.metadata).equals(Buffer.from(newMetadata)));
    });

    it("should transfer project to new owner", async () => {
      let [newOwner, _] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("user"),
          Keypair.generate().publicKey.toBuffer(),
        ],
        program.programId,
      );

      const ix = await program.methods
        .transferProject()
        .accounts({
          authority: userKeypair.publicKey,
          projectAccount: projectPDA,
          transferUserAccount: newOwner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([userKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = userKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const project = await program.account.project.fetch(projectPDA);

      assert.ok(project.owner.equals(newOwner));
    });
  });
});
