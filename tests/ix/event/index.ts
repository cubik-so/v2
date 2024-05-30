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
import { PublicKey } from "@solana/web3.js";

const connection = createDevnetConnection();
describe("Event", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  console.log("Create Key: ", createKey.publicKey.toBase58());

  const newTeamMember = web3.Keypair.generate();
  const projectCreationKey = web3.Keypair.generate();

  describe("Event Creation", () => {
    it("Create Event Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
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
    it("Create Event Update Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
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
    it("Event Team Creation Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const eventAccount = getEventPDA(createKey.publicKey)[0];

      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      const newEventTeamAccount = getEventTeamPDA(
        eventAccount,
        newTeamMember.publicKey
      )[0];

      const tx = await program.methods
        .eventTeamCreate({
          newTeamMember: newTeamMember.publicKey,
        })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventTeamAccount: eventTeamAccount,
          newEventTeamAccount: newEventTeamAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Event Team Close", () => {
    it("Event Team Close Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const toCloseEventTeamAccount = getEventTeamPDA(
        eventAccount,
        newTeamMember.publicKey
      )[0];

      const tx = await program.methods
        .eventTeamClose()
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          toCloseEventTeamAccount: toCloseEventTeamAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Event Participant Create", () => {
    it("Event Participant Create Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      // project creation

      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      await program.methods
        .projectCreate({
          memo: "some",
          metadata: "something",
        })
        .accounts({
          createKey: projectCreationKey.publicKey,
          multisig: getMultisigPDA(projectCreationKey.publicKey)[0],
          creator: wallet.publicKey,
          programConfigPda: programConfigPda,
          projectAccount: getProjectPDA(projectCreationKey.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, projectCreationKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      // genrate event team creation
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(projectCreationKey.publicKey)[0];

      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      const newEventTeamAccount = getEventTeamPDA(
        eventAccount,
        newTeamMember.publicKey
      )[0];

      await program.methods
        .eventTeamCreate({
          newTeamMember: newTeamMember.publicKey,
        })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventTeamAccount: eventTeamAccount,
          newEventTeamAccount: newEventTeamAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      // event particapnat tx

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
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });

  describe("Event Participant Update", () => {
    it("Event Participant Update", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      // genrate event team creation
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(projectCreationKey.publicKey)[0];

      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      // event Participant Update Tx
      const tx = await program.methods
        .eventParticipantUpdate({
          status: {
            approved: {},
          },
        })
        .accounts({
          eventAccount: eventAccount,
          eventParticipantAccount: getEventParticipantPDA(
            eventAccount,
            projectAccount
          )[0],
          eventTeamAccount: eventTeamAccount,
          projectAccount: projectAccount,
          systemProgram: web3.SystemProgram.programId,
          team: wallet.publicKey,
        })
        .signers([wallet.payer])
        .rpc({
          maxRetries: 3,
          commitment: "confirmed",
        });

      console.log(tx);
    });
  });

  describe("Event Participant Invite", () => {
    it("Event Participant Invite Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const tempProjectKey = web3.Keypair.generate();

      // project creation

      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      await program.methods
        .projectCreate({
          memo: "some",
          metadata: "something",
        })
        .accounts({
          createKey: tempProjectKey.publicKey,
          multisig: getMultisigPDA(tempProjectKey.publicKey)[0],
          creator: wallet.publicKey,
          programConfigPda: programConfigPda,
          projectAccount: getProjectPDA(tempProjectKey.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, tempProjectKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(tempProjectKey.publicKey)[0];

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
          team: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
});
