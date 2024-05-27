import {
  getEventPDA,
  getEventParticipantPDA,
  getEventTeamPDA,
  getMultisigPDA,
  getProjectPDA,
  getTeamPDA,
} from "../../pda";
import {
  generateKeypair,
  adminKeypair,
  createCubikProgram,
  SQUADS_PROGRAM_ID,
  getProgramConfigPda,
  ProgramConfig,
  createDevnetConnection,
} from "../../utils";
import { BN, Wallet, web3 } from "@coral-xyz/anchor";

const connection = createDevnetConnection();
describe("Event", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Event Creation", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Create Event Idel Flow", async () => {
      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      const tx = await program.methods
        .eventCreate({
          memo: "something",
          metadata: "some",
          endingSlot: new BN(2),
          startSlot: new BN(1),
        })
        .accounts({
          authority: wallet.publicKey,
          createKey: createKey.publicKey,
          multisig: getMultisigPDA(createKey.publicKey)[0],
          eventAccount: eventAccount,
          eventTeamAccount: eventTeamAccount,
          programConfigPda: programConfigPda,
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
  describe("Event Updation", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Create Event Update Idel Flow", async () => {
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      const tx = await program.methods
        .eventUpdate({
          metadata: "something",
          endingSlot: new BN(2),
          startSlot: new BN(1),
        })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: getEventPDA(createKey.publicKey)[0],
          eventTeamAccount: eventTeamAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
  describe("Event Team Creation", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    const eventAccount = getEventPDA(createKey.publicKey)[0];
    const eventTeamAccount = getEventTeamPDA(eventAccount, wallet.publicKey)[0];
    it("Event Team Creation Idel Case", async () => {
      const tx = await program.methods
        .eventTeamCreate({
          newTeamMember: wallet.publicKey,
        })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventTeamAccount: eventTeamAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });
  });
  describe("Event Team Close", () => {});
  describe("Event Participant Create", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Event Participant Create Idel Case", async () => {
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(createKey.publicKey)[0];

      const tx = await program.methods
        .eventParticipantCreate()
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventParticipantAccount: getEventParticipantPDA(
            eventAccount,
            projectAccount
          )[0],
          projectAccount: projectAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
  describe("Event Participant Update", () => {});
  describe("Event Participant Invite", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Event Participant Invite Idel Case", async () => {
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(createKey.publicKey)[0];
      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      const tx = await program.methods
        .eventParticipantInvite()
        .accounts({
          eventAccount: eventAccount,
          eventParticipantAccount: getEventParticipantPDA(
            eventAccount,
            projectAccount
          )[0],
          eventTeamAccount: eventTeamAccount,
          projectAccount: projectAccount,
          systemProgram: web3.SystemProgram.programId,
          team: getTeamPDA(createKey.publicKey)[0],
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });
  });
});
