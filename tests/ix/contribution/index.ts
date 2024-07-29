import { BN, min } from "bn.js";
import {
  generateKeypair,
  adminKeypair,
  createCubikProgram,
  createDevnetConnection,
  getProgramConfigPda,
  SQUADS_PROGRAM_ID,
  ProgramConfig,
} from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";
import {
  getEventPDA,
  getEventParticipantPDA,
  getEventTeamPDA,
  getMultisigPDA,
  getProjectPDA,
} from "../../pda";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  contributionSol,
  contributionSpl,
  createEvent,
  createProject,
} from "../../comman";
import assert from "assert";

const connection = createDevnetConnection();
describe("Contribution", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  const projectCreationKey = web3.Keypair.generate();
  const eventCreationKey = web3.Keypair.generate();

  describe("Contribution SPL", () => {
    it("Contribution SPL Idel Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(createKey.publicKey)[0];

      // TODO : Mint Address
      const tokenMint = new PublicKey("");
      const sernderATA = getAssociatedTokenAddressSync(
        tokenMint,
        wallet.publicKey
      );
      const reciverATA = getAssociatedTokenAddressSync(
        tokenMint,
        createKey.publicKey,
        true
      );
      const tx = await program.methods
        .contributionSpl({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventParticipantAccount: getEventParticipantPDA(
            eventAccount,
            projectAccount
          )[0],
          projectAccount: projectAccount,
          systemProgram: web3.SystemProgram.programId,
          tokenAtaReceiver: reciverATA,
          tokenAtaSender: sernderATA,
          tokenMint: tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });

    it("Contribution SPL Failed Due To The Wrong Wallet Authority and Signer", async () => {
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

      const eventCreateKey = generateKeypair();
      const eventKeypair = generateKeypair();
      const eventWallet = new Wallet(eventKeypair);

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/3456",
        wallet: eventWallet,
      });

      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);

      const contributionCreateKey = generateKeypair();
      const contributionWallet = new Wallet(contributionCreateKey);
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
      await assert.rejects(() =>
        contributionSpl({
          contributedAmount: new BN(2),
          contributionCreateKey,
          eventCreateKey,
          projectCreateKey,
          tokenMint,
          wallet: burnnerWallet,
          authoirtyWallet: contributionWallet,
        })
      );
    });

    it("Contribution SPL Failed Due To The  EventCreateKey", async () => {
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

      const burnnerEventCreateKey = generateKeypair();

      const contributionCreateKey = generateKeypair();
      const contributionWallet = new Wallet(contributionCreateKey);
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
      await assert.rejects(() =>
        contributionSpl({
          contributedAmount: new BN(2),
          contributionCreateKey,
          eventCreateKey: burnnerEventCreateKey,
          projectCreateKey,
          tokenMint,
          wallet: contributionWallet,
          authoirtyWallet: contributionWallet,
        })
      );
    });

    it("Contribution SPL Failed Due To The  Wrong ProjectKey ", async () => {
      const burnnerProjectCreateKey = generateKeypair();

      const eventCreateKey = generateKeypair();
      const eventKeypair = generateKeypair();
      const eventWallet = new Wallet(eventKeypair);

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/3456",
        wallet: eventWallet,
      });

      const contributionCreateKey = generateKeypair();
      const contributionWallet = new Wallet(contributionCreateKey);
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
      await assert.rejects(() =>
        contributionSpl({
          contributedAmount: new BN(2),
          contributionCreateKey,
          eventCreateKey,
          projectCreateKey: burnnerProjectCreateKey,
          tokenMint,
          wallet: contributionWallet,
          authoirtyWallet: contributionWallet,
        })
      );
    });

    it("Contribution SPL Failed Due To The  Wrong ProjectKey  & Event Key", async () => {
      const burnnerProjectCreateKey = generateKeypair();

      const burnnerEventCreateKey = generateKeypair();

      const contributionCreateKey = generateKeypair();
      const contributionWallet = new Wallet(contributionCreateKey);
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
      await assert.rejects(() =>
        contributionSpl({
          contributedAmount: new BN(2),
          contributionCreateKey,
          eventCreateKey: burnnerEventCreateKey,
          projectCreateKey: burnnerProjectCreateKey,
          tokenMint,
          wallet: contributionWallet,
          authoirtyWallet: contributionWallet,
        })
      );
    });

    it("Contribution Failed Due To The ReciverATA not found Due The Wrong Token Mint", async () => {
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

      const eventCreateKey = generateKeypair();
      const eventKeypair = generateKeypair();
      const eventWallet = new Wallet(eventKeypair);

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/3456",
        wallet: eventWallet,
      });

      const contributionCreateKey = generateKeypair();
      const contributionWallet = new Wallet(contributionCreateKey);
      const tokenMint = new PublicKey("EPjFWd");
      await assert.rejects(() =>
        contributionSpl({
          contributedAmount: new BN(2),
          contributionCreateKey,
          eventCreateKey,
          projectCreateKey,
          tokenMint,
          wallet: contributionWallet,
          authoirtyWallet: contributionWallet,
        })
      );
    });

    it("Contribution Failed Due To The ReciverATA not found Due The Wrong contributionCreateKey", async () => {
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

      const eventCreateKey = generateKeypair();
      const eventKeypair = generateKeypair();
      const eventWallet = new Wallet(eventKeypair);

      await createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/3456",
        wallet: eventWallet,
      });

      const burrnerContributionCreateKey = generateKeypair();

      const contributionCreateKey = generateKeypair();
      const contributionWallet = new Wallet(contributionCreateKey);
      const tokenMint = new PublicKey("EPjFWd");
      await assert.rejects(() =>
        contributionSpl({
          contributedAmount: new BN(2),
          contributionCreateKey: burrnerContributionCreateKey,
          eventCreateKey,
          projectCreateKey,
          tokenMint,
          wallet: contributionWallet,
          authoirtyWallet: contributionWallet,
        })
      );
    });
  });
  describe("Contribution SOL", () => {
    it("Contribution SOL Ideal Case", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      // Project creation
      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];
      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const projectPda = getProjectPDA(projectCreationKey.publicKey)[0];

      await program.methods
        .projectCreate({ memo: "some", metadata: "something" })
        .accounts({
          createKey: projectCreationKey.publicKey,
          multisig: getMultisigPDA(projectCreationKey.publicKey)[0],
          creator: wallet.publicKey,
          programConfigPda: programConfigPda,
          projectAccount: projectPda,
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, projectCreationKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

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

      // Ensure event account is created

      // Event participant creation
      const eventParticipantAccount = getEventParticipantPDA(
        eventAccount,
        projectPda
      )[0];

      await program.methods
        .eventParticipantCreate()
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventParticipantAccount: eventParticipantAccount,
          projectAccount: projectPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      // Ensure event participant account is created

      // Contribution SOL
      const projectAccountPDA = getProjectPDA(projectCreationKey.publicKey)[0];
      let projectAccountKey = await program.account.project.fetch(
        projectAccountPDA
      );

      const tx = await program.methods
        .contributionSol({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: eventAccount,
          eventParticipantAccount: eventParticipantAccount,
          projectAccount: projectAccountPDA,
          receiver: projectAccountKey.receiver,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });

    it("Contribution SOL Failed Due To the wrong ProjectCreateskey", async () => {
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

      const eventCreateKey = generateKeypair();
      const eventKeypair = generateKeypair();
      const eventWallet = new Wallet(eventKeypair);

      createEvent({
        connection,
        eventCreateKey,
        eventEndingSlot: new BN(2),
        eventStartingSlot: new BN(1),
        memo: "Some",
        metadata: "https://m.cubik.so/e/3456",
        wallet: eventWallet,
      });

      const burnnerKeypair = generateKeypair();
      const burnnerWallet = new Wallet(burnnerKeypair);
      const burnnerCreateKey = generateKeypair();

      await assert.rejects(() =>
        contributionSol({
          projectCreateKey: burnnerCreateKey,
          eventCreateKey,
          wallet: burnnerWallet,
        })
      );
    });
  });
});

/*

- Test Case


-> SPL

- wrong wallet for  authority
- eventAccount Not Found
- projectAccount not found
- eventParicipantAccount Not Found(means bhot project account and event account is wrong) [i]
- reciverAtA not found


-> SOL
- wrong projectCreate Key

*/
