import assert from "assert";
import {
  closeEventTeam,
  createEvent,
  createEventParticipant,
  createEventTeam,
  createProject,
  inviteEventParticipant,
  updateEvent,
  updateEventParticipant,
} from "../../comman";
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
  createLocalnetConnection,
} from "../../utils";
import { BN, Wallet, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// const connection = createDevnetConnection();
const connection = createLocalnetConnection();
describe("Event", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

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

    it("Event Createtion Failed Due To MetaData Length Greater then 30 ", async () => {
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      // const tx = await createEvent({
      //   connection,
      //   eventCreateKey,
      //   eventEndingSlot: endingSlot,
      //   eventStartingSlot: startingSlot,
      //   memo: "memo",
      //   metadata: "https://m.cubik.so/p/123456789098765432345653456789678",
      //   wallet: evnetOwnerWallet,
      // });

      assert.rejects(() =>
        createEvent({
          connection,
          eventCreateKey,
          eventEndingSlot: new BN(2),
          eventStartingSlot: new BN(1),
          memo: "memo",
          metadata: "https://m.cubik.so/e/123456789098765432345653456789678",
          wallet: evnetOwnerWallet,
        })
      );
    });

    it("Event Createtion Failed Due To The Wrong Data Type of eventEndSlot", async () => {
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await assert.rejects(() =>
        createEvent({
          connection,
          eventCreateKey,
          eventEndingSlot: new BN([1, 2]),
          eventStartingSlot: new BN(1),
          memo: "memo",
          metadata: "https://m.cubik.so/e/1298",
          wallet: evnetOwnerWallet,
        })
      );
    });
    it("Event Createtion Failed Due To The Wrong Data Type of startSlot", async () => {
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await assert.rejects(() =>
        createEvent({
          connection,
          eventCreateKey,
          eventEndingSlot: new BN(2),
          eventStartingSlot: new BN("1"),
          memo: "memo",
          metadata: "https://m.cubik.so/e/1298",
          wallet: evnetOwnerWallet,
        })
      );
    });
  });

  describe("Event Updation", () => {
    it(" Event Update Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const eventTeamAccount = getEventTeamPDA(
        eventAccount,
        wallet.publicKey
      )[0];

      const tx = await program.methods
        .eventUpdate({
          metadata: "https://m.cubik.so/e/12",
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

    it("Event Update Failed Due To The Length of MetaData", async () => {
      const eventOwnerKeypair = generateKeypair();
      const eventOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      // create evnet 1

      createEvent({
        connection,
        eventCreateKey: eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/123",
        wallet: eventOwnerWallet,
      });

      assert.rejects(() =>
        updateEvent({
          metaData: "https://m.cubik.so/e/169275208bv359ubniu35bniu3ni35n2",
          eventEndingSlot: new BN(2),
          eventStartingSlot: new BN(1),
          eventCreateKey: eventCreateKey,
          wallet: eventOwnerWallet,
        })
      );
    });

    it("Event Update Failed Due To The Wrong Data Type of eventEndSlot", async () => {
      const eventOwnerKeypair = generateKeypair();
      const eventOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      // create evnet 1

      createEvent({
        connection,
        eventCreateKey: eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/123",
        wallet: eventOwnerWallet,
      });

      assert.rejects(() =>
        updateEvent({
          metaData: "https://m.cubik.so/e/v324",
          eventEndingSlot: new BN([2, 3, 4]),
          eventStartingSlot: new BN(1),
          eventCreateKey: eventCreateKey,
          wallet: eventOwnerWallet,
        })
      );
    });

    it("Event Update Failed Due To The Wrong Data Type of eventStartSlot", async () => {
      const eventOwnerKeypair = generateKeypair();
      const eventOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      // create evnet 1

      createEvent({
        connection,
        eventCreateKey: eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/123",
        wallet: eventOwnerWallet,
      });

      assert.rejects(() =>
        updateEvent({
          metaData: "https://m.cubik.so/e/v324",
          eventEndingSlot: new BN(2),
          eventStartingSlot: new BN("1"),
          eventCreateKey: eventCreateKey,
          wallet: eventOwnerWallet,
        })
      );
    });

    it("Event Update Falied Due To EventCreateKey is Diffrent ", async () => {
      const event1OwnerKeypair = generateKeypair();
      const event1OwnerWallet = new Wallet(event1OwnerKeypair);
      const event1CreateKey = generateKeypair();

      // create evnet 1

      createEvent({
        connection,
        eventCreateKey: event1CreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/123",
        wallet: event1OwnerWallet,
      });

      // create event 2

      const event2OwnerKeypair = generateKeypair();
      const event2OwnerWallet = new Wallet(event2OwnerKeypair);
      const event2CreateKey = generateKeypair();

      createEvent({
        connection,
        eventCreateKey: event2CreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/987",
        wallet: event2OwnerWallet,
      });

      // now we update event 1 with the event 2 create key
      //  const tx = await   updateEvent({
      //       metaData: "https://m.cubik.so/e/12",
      //       eventEndingSlot: new BN(2),
      //       eventStartingSlot: new BN(1),
      //       eventCreateKey: event2CreateKey,
      //       wallet: event1OwnerWallet,
      //     });

      assert.rejects(() =>
        updateEvent({
          metaData: "https://m.cubik.so/e/12",
          eventEndingSlot: new BN(2),
          eventStartingSlot: new BN(1),
          eventCreateKey: event2CreateKey,
          wallet: event1OwnerWallet,
        })
      );
    });

    it("Event Update Falied Due To Wrong Event Owner Wallet is Diffrent ", async () => {
      const event1OwnerKeypair = generateKeypair();
      const event1OwnerWallet = new Wallet(event1OwnerKeypair);
      const event1CreateKey = generateKeypair();

      // create evnet 1

      createEvent({
        connection,
        eventCreateKey: event1CreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/45",
        wallet: event1OwnerWallet,
      });

      // create event 2

      const event2OwnerKeypair = generateKeypair();
      const event2OwnerWallet = new Wallet(event2OwnerKeypair);
      const event2CreateKey = generateKeypair();

      createEvent({
        connection,
        eventCreateKey: event2CreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/78",
        wallet: event2OwnerWallet,
      });

      // now we update event 1 with the event 2 wallet
      //  const tx = await   updateEvent({
      //       metaData: "https://m.cubik.so/e/12",
      //       eventEndingSlot: new BN(2),
      //       eventStartingSlot: new BN(1),
      //       eventCreateKey: event2CreateKey,
      //       wallet: event1OwnerWallet,
      //     });

      assert.rejects(() =>
        updateEvent({
          metaData: "https://m.cubik.so/e/46",
          eventEndingSlot: new BN(2),
          eventStartingSlot: new BN(1),
          eventCreateKey: event1CreateKey,
          wallet: event2OwnerWallet,
        })
      );
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

    it("Event Team Creation failed Cause of wrong wallet  ", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      const evnetTx = await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/123",
        wallet: evnetOwnerWallet,
      });

      // create event team with wrong wallet

      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);
      const teamMember = web3.Keypair.generate();

      const tx = await createEventTeam({
        eventCreateKey,
        teamMember,
        wallet: burnnerWallet,
      });

      assert.rejects(() =>
        createEventTeam({
          eventCreateKey,
          teamMember,
          wallet: burnnerWallet,
        })
      );
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

    it("Event Team Close Faliled casuse of diffrent authoirty", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/123",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      createEventTeam({ eventCreateKey, teamMember, wallet: evnetOwnerWallet });

      // now we try to close the event account
      const burnerKeypair = generateKeypair();
      const BurnerWallet = new Wallet(burnerKeypair);

      await assert.rejects(() =>
        closeEventTeam({
          eventCreateKey: createKey,
          eventTeamMemberKey: newTeamMember,
          wallet: BurnerWallet,
        })
      );
    });

    it("Event Team Close Failed Wrong Event Account", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/123",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      createEventTeam({ eventCreateKey, teamMember, wallet: evnetOwnerWallet });

      // now we try to close the event account
      const burrnerCreateKey = web3.Keypair.generate();

      await assert.rejects(() =>
        closeEventTeam({
          eventCreateKey: burrnerCreateKey,
          eventTeamMemberKey: newTeamMember,
          wallet: evnetOwnerWallet,
        })
      );
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
      const projectAccount = getProjectPDA(projectCreationKey.publicKey)[0];

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

    it("Event Participant Create Failed Due To diffrent in authority and signers", async () => {
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = generateKeypair();

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/p975",
        wallet: evnetOwnerWallet,
      });

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);
      await assert.rejects(() =>
        createEventParticipant({
          eventCreateKey,
          projectCreateKey,
          wallet: evnetParticiantWallet,
          authorityWallet: burnnerWallet,
        })
      );
    });

    it("Event Participant Create Failed Due To Wrong EventAccount", async () => {
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = generateKeypair();

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      const burnnerKeypair = generateKeypair();

      await assert.rejects(() =>
        createEventParticipant({
          eventCreateKey: burnnerKeypair,
          projectCreateKey,
          wallet: evnetParticiantWallet,
          authorityWallet: evnetParticiantWallet,
        })
      );
    });

    it("Event Participant Create Failed Due To diffrent Wrong projectAccount", async () => {
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/p975",
        wallet: evnetOwnerWallet,
      });

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      const burnnerKeypair = generateKeypair();

      await assert.rejects(() =>
        createEventParticipant({
          eventCreateKey,
          projectCreateKey: burnnerKeypair,
          wallet: evnetParticiantWallet,
          authorityWallet: evnetParticiantWallet,
        })
      );
    });
  });

  describe("Event Participant Update", () => {
    it("Event Participant Update", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

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

    it("Event Particiant Update Failed Due To The Wrong eventParticipant Wallet", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/346",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      await createEventTeam({
        eventCreateKey,
        teamMember,
        wallet: evnetOwnerWallet,
      });

      // create project
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const ProjectCreateKey = generateKeypair();
      const ProjectTx = await createProject({
        connection: connection,
        projectCreateKey: ProjectCreateKey,
        wallet: ProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // now participation create

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      await createEventParticipant({
        eventCreateKey,
        projectCreateKey: ProjectCreateKey,
        wallet: evnetParticiantWallet,
        authorityWallet: evnetParticiantWallet,
      });

      // no we update this participation
      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);

      assert.rejects(() =>
        updateEventParticipant({
          eventCreateKey,
          projectCreateKey: ProjectCreateKey,
          wallet: burnnerWallet,
        })
      );
    });

    it("Event Particiant Update Failed Due To The Wrong projectAccount", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/346",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      await createEventTeam({
        eventCreateKey,
        teamMember,
        wallet: evnetOwnerWallet,
      });

      // create project
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const ProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: ProjectCreateKey,
        wallet: ProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // now participation create

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      await createEventParticipant({
        eventCreateKey,
        projectCreateKey: ProjectCreateKey,
        wallet: evnetParticiantWallet,
        authorityWallet: evnetParticiantWallet,
      });

      // no we update this participation
      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);

      const burnnerProjectCreateKey = generateKeypair();

      await assert.rejects(() =>
        updateEventParticipant({
          eventCreateKey,
          projectCreateKey: burnnerProjectCreateKey,
          wallet: burnnerWallet,
        })
      );
    });

    it("Event Particiant Update Failed Due To The Wrong EventCreateKey", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/346",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      await createEventTeam({
        eventCreateKey,
        teamMember,
        wallet: evnetOwnerWallet,
      });

      // create project
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const ProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: ProjectCreateKey,
        wallet: ProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // now participation create

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      await createEventParticipant({
        eventCreateKey,
        projectCreateKey: ProjectCreateKey,
        wallet: evnetParticiantWallet,
        authorityWallet: evnetParticiantWallet,
      });

      // no we update this participation
      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);

      const burnnerEventCreateKey = generateKeypair();

      await assert.rejects(() =>
        updateEventParticipant({
          eventCreateKey: burnnerEventCreateKey,
          projectCreateKey: ProjectCreateKey,
          wallet: burnnerWallet,
        })
      );
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

    it("Event Participant Invite  Failed Due To The Wrong EventCreateKey", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/346",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      await createEventTeam({
        eventCreateKey,
        teamMember,
        wallet: evnetOwnerWallet,
      });

      // create project
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const ProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: ProjectCreateKey,
        wallet: ProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // now participation create

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      await createEventParticipant({
        eventCreateKey,
        projectCreateKey: ProjectCreateKey,
        wallet: evnetParticiantWallet,
        authorityWallet: evnetParticiantWallet,
      });

      // no we update this participation
      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);

      const burnnerEventCreateKey = generateKeypair();

      await assert.rejects(() =>
        inviteEventParticipant({
          eventCreateKey: burnnerEventCreateKey,
          projectCreateKey: ProjectCreateKey,
          wallet: burnnerWallet,
        })
      );
    });

    it("Event Participant Invite  Failed Due To The Wrong ProjectCreateKey", async () => {
      // create event
      const eventOwnerKeypair = generateKeypair();
      const evnetOwnerWallet = new Wallet(eventOwnerKeypair);
      const eventCreateKey = generateKeypair();

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "memo",
        metadata: "https://m.cubik.so/e/346",
        wallet: evnetOwnerWallet,
      });

      // create event team

      const teamMember = web3.Keypair.generate();

      await createEventTeam({
        eventCreateKey,
        teamMember,
        wallet: evnetOwnerWallet,
      });

      // create project
      const ProjectOwnerKeypair = generateKeypair();
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const ProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: ProjectCreateKey,
        wallet: ProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // now participation create

      const eventPartcipantKeypair = generateKeypair();
      const evnetParticiantWallet = new Wallet(eventPartcipantKeypair);

      await createEventParticipant({
        eventCreateKey,
        projectCreateKey: ProjectCreateKey,
        wallet: evnetParticiantWallet,
        authorityWallet: evnetParticiantWallet,
      });

      // no we update this participation
      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);

      const burnnerProjectCreateKey = generateKeypair();

      await assert.rejects(() =>
        inviteEventParticipant({
          eventCreateKey,
          projectCreateKey: burnnerProjectCreateKey,
          wallet: burnnerWallet,
        })
      );
    });
  });
});
