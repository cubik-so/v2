import { getEventPDA, getMultisigPDA, getSponserPDA } from "../../pda";
import {
  generateKeypair,
  adminKeypair,
  createCubikProgram,
  getProgramConfigPda,
  SQUADS_PROGRAM_ID,
  ProgramConfig,
  createDevnetConnection,
} from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";

describe("Sponsor", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  const connection = createDevnetConnection();
  describe("Sponsor Create", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Sponsor Create Idel Case", async () => {
      const tx = await program.methods
        .sponsorCreate({ metadata: "something" })
        .accounts({
          authority: wallet.publicKey,
          createKey: createKey.publicKey,
          eventAccount: getEventPDA(createKey.publicKey)[0],
          sponsorAccount: getSponserPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Sponsor Create Custody", async () => {
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
        eventAccount: getEventPDA(createKey.publicKey)[0],
        multisig: getMultisigPDA(createKey.publicKey)[0],
        programConfigPda: programConfigPda,
        sponsorAccount: getSponserPDA(createKey.publicKey)[0],
        squadsProgram: SQUADS_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        treasury: programConfig.treasury,
      })
      .signers([wallet.payer, createKey])
      .rpc({ maxRetries: 3, commitment: "confirmed" });

    console.log(tx);
  });
  describe("Sponsor Update", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Sponser Update Idel Case", async () => {
      const tx = await program.methods
        .sponsorUpdate({ metadata: "something" })
        .accounts({
          authority: wallet.publicKey,
          sponsorAccount: getSponserPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
  describe("Sponsor close", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Sponser Close Idel Case", async () => {
      const tx = await program.methods
        .sponsorClose()
        .accounts({
          authority: wallet.publicKey,
          sponsorAccount: getSponserPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
});
