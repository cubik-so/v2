import { BN } from "bn.js";
import {
  getEventPDA,
  getEventTeamPDA,
  getMultisigPDA,
  getSponsorPDA,
} from "../../pda";
import {
  generateKeypair,
  adminKeypair,
  createCubikProgram,
  getProgramConfigPda,
  SQUADS_PROGRAM_ID,
  ProgramConfig,
  createDevnetConnection,
  PROGRAM_ID,
} from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";

describe("Sponsor", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  const eventCreationKey = web3.Keypair.generate();

  const connection = createDevnetConnection();
  describe("Sponsor Create", () => {
    it("Sponsor Create Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      // Event creation
      const eventAccount = getEventPDA(eventCreationKey.publicKey)[0];

      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      await program.methods
        .eventCreate({
          memo: "something",
          metadata: "some",
          endingSlot: new BN(2),
          startSlot: new BN(1),
        })
        .accounts({
          authority: wallet.publicKey,
          createKey: eventCreationKey.publicKey,
          multisig: getMultisigPDA(eventCreationKey.publicKey)[0],
          eventAccount: eventAccount,
          eventTeamAccount: eventTeamAccount,
          programConfigPda: programConfigPda,
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, eventCreationKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      // sponser creation

      const tx = await program.methods
        .sponsorCreate({ metadata: "something" })
        .accounts({
          authority: wallet.publicKey,
          createKey: createKey.publicKey,
          eventAccount: eventAccount,
          sponsorAccount: getSponsorPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Sponsor Create Custody", async () => {
    it("Sponsor Create Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const tx = await program.methods
        .sponsorCreateCustody({
          member: createKey.publicKey,
          memo: "some",
          metadata: "Something",
        })
        .accounts({
          authority: wallet.publicKey,
          createKey: createKey.publicKey,
          eventAccount: getEventPDA(eventCreationKey.publicKey)[0],
          multisig: getMultisigPDA(createKey.publicKey)[0],
          programConfigPda: programConfigPda,
          sponsorAccount: getSponsorPDA(createKey.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Sponsor Update", () => {
    it("Sponser Update Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const tx = await program.methods
        .sponsorUpdate({ metadata: "something" })
        .accounts({
          authority: wallet.publicKey,
          sponsorAccount: getSponsorPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Sponsor close", () => {
    it("Sponser Close Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const tx = await program.methods
        .sponsorClose()
        .accounts({
          authority: wallet.publicKey,
          sponsorAccount: getSponsorPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
});
