import * as anchor from "@coral-xyz/anchor";
import { adminKeypair, adminPDA, program } from "../utils";
import { expect } from "chai";
import { config } from "dotenv";

config();

describe("Admin", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  describe("createAdmin", () => {
    it("should create an admin", async () => {
      console.log(adminPDA.toString());
      const tx = await program.methods
        .createAdmin()
        .accounts({
          authority: adminKeypair.publicKey,
          adminAccount: adminPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc({
          commitment: "processed",
        });

      console.log(tx);

      // const admin = await program.account.admin.fetch(adminPDA);

      // expect(admin.authority).to.eql(adminKeypair.publicKey);
    });
  });
});
