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

describe("Event", async () => {
  let provider: anchor.Provider;
  let eventPDA: anchor.web3.PublicKey;
  let projectPDA: anchor.web3.PublicKey;
  let eventJoinPDA: anchor.web3.PublicKey;
  let matchingPool = new anchor.BN(65);
  let counter = new anchor.BN(0);
  let metadata = Keypair.generate().publicKey.toBuffer() as unknown as number[];
  let eventKey = Keypair.generate();
  let createKey = Keypair.generate();

  provider = getProvider(userKeypair);

  eventPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("event"), eventKey.publicKey.toBuffer()],
    program.programId,
  )[0];

  projectPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("project"),
      createKey.publicKey.toBuffer(),
      counter.toBuffer(),
    ],
    program.programId,
  )[0];

  eventJoinPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("event_join"),
      eventPDA.toBuffer(),
      projectPDA.toBuffer(),
    ],
    program.programId,
  )[0];

  let [eventSubAdminPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("admin"),
      subAdminKeypair.publicKey.toBuffer(),
      eventKey.publicKey.toBuffer(),
    ],
    program.programId,
  );

  before(async () => {
    // await airdrop(newUserKeypair);
  });

  describe("createEvent", () => {
    it("should create an event", async () => {
      const ix = await program.methods
        .createEvent(matchingPool, metadata)
        .accounts({
          authority: userKeypair.publicKey,
          eventAccount: eventPDA,
          eventKey: eventKey.publicKey,
          subAdminAccount: subAdminPDA,
          userAccount: userPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([userKeypair, eventKey])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = userKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const event = await program.account.event.fetch(eventPDA);

      assert.ok(event.matchingPool.toBuffer().equals(matchingPool.toBuffer()));
    });

    it("should update an event", async () => {
      let newMetadata =
        Keypair.generate().publicKey.toBuffer() as unknown as number[];
      let newMatchingPool = new anchor.BN(100);
      const ix = await program.methods
        .updateEvent(newMatchingPool, newMetadata)
        .accounts({
          authority: userKeypair.publicKey,
          eventAccount: eventPDA,
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

      const event = await program.account.event.fetch(eventPDA);

      assert.ok(
        event.matchingPool.toBuffer().equals(newMatchingPool.toBuffer()),
      );
    });

    it("should create an event join", async () => {
      const ix = await program.methods
        .createEventJoin(counter, eventKey.publicKey)
        .accounts({
          authority: userKeypair.publicKey,
          eventAccount: eventPDA,
          eventJoinAccount: eventJoinPDA,
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

      const event = await program.account.event.fetch(eventPDA);

      assert.ok(event.matchingPool.toBuffer().equals(matchingPool.toBuffer()));
    });

    it("should update approve an event", async () => {
      const ix = await program.methods
        .updateEventJoinStatusApprove()
        .accounts({
          authority: subAdminKeypair.publicKey,
          eventAccount: eventPDA,
          subAdminAccount: subAdminPDA,
          eventJoinAccount: eventJoinPDA,
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
    });

    it("should update reject an event", async () => {
      const ix = await program.methods
        .updateEventJoinStatusRejected()
        .accounts({
          authority: subAdminKeypair.publicKey,
          eventAccount: eventPDA,
          subAdminAccount: subAdminPDA,
          eventJoinAccount: eventJoinPDA,
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
    });

    it("should invite an event join", async () => {
      const ix = await program.methods
        .inviteEventJoin()
        .accounts({
          authority: subAdminKeypair.publicKey, // full perms sub admin
          eventAccount: eventPDA,
          subAdminAccount: subAdminPDA,
          eventJoinAccount: eventJoinPDA,
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
    });
  });
});
