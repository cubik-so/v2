import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { program, getProvider, airdrop } from "../utils";
import { Keypair } from "@solana/web3.js";

describe("User", async () => {
  let newUserKeypair: anchor.web3.Keypair;
  let provider: anchor.Provider;
  let newUserPDA: anchor.web3.PublicKey;
  let metadata = Keypair.generate().publicKey.toBuffer() as unknown as number[];

  newUserKeypair = anchor.web3.Keypair.generate();
  provider = getProvider(newUserKeypair);

  newUserPDA = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("user"),
      newUserKeypair.publicKey.toBuffer(),
    ],
    program.programId,
  )[0];

  console.log(newUserPDA.toBase58());
  console.log(newUserKeypair.publicKey.toBase58());

  before(async () => {
    await airdrop(newUserKeypair);
  });

  describe("createUser", () => {
    it("should create a user with length < 32 chars", async () => {
      const ix = await program.methods
        .createUser("sahil", metadata)
        .accounts({
          authority: newUserKeypair.publicKey,
          userAccount: newUserPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([newUserKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = newUserKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const user = await program.account.user.fetch(newUserPDA);

      assert.ok(user.authority.equals(newUserKeypair.publicKey));
    });

    it("should update an user", async () => {
      metadata = Keypair.generate().publicKey.toBuffer() as unknown as number[];
      const ix = await program.methods
        .updateUser(metadata)
        .accounts({
          authority: newUserKeypair.publicKey,
          userAccount: newUserPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([newUserKeypair])
        .instruction();

      const tx = new anchor.web3.Transaction().add(ix);

      tx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      tx.feePayer = newUserKeypair.publicKey;

      await provider.sendAndConfirm(tx);

      const user = await program.account.user.fetch(newUserPDA);

      assert.ok(user.authority.equals(newUserKeypair.publicKey));
    });
  });
});
