import { BN } from "bn.js";
import { getMultisigPDA, getProjectPDA } from "../../pda";
import {
  generateKeypair,
  adminKeypair,
  createCubikProgram,
  getProgramConfigPda,
  SQUADS_PROGRAM_ID,
  ProgramConfig,
  createDevnetConnection,
  generateFundedKeypair,
  createLocalnetConnection,
} from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  closeProject,
  createProject,
  tipSOLProject,
  tipSPLProject,
  transferProject,
  updateProject,
} from "../../comman";
import assert from "assert";

//const connection = createDevnetConnection();
const connection = createLocalnetConnection();

describe("Project", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Project Creation", () => {
    it("Project Creation Ideal Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      console.log("ProgramConfigPDA : ", programConfigPda.toBase58());

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      console.log("program Config : ", programConfig.authority.toBase58());

      await program.methods
        .projectCreate({
          memo: "some",
          metadata: "something",
        })
        .accounts({
          createKey: createKey.publicKey,
          multisig: getMultisigPDA(createKey.publicKey)[0],
          creator: wallet.publicKey,
          programConfigPda: programConfigPda,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, createKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });

    it("Project Creation Failed MetaData Length Greater then 30 ", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = generateKeypair();

      await assert.rejects(
        () =>
          createProject({
            connection: connection,
            memo: "memo",
            metadata: "https://m.cubik.so/p/123456789098765432345653456789678",
            projectCreateKey: projectCreateKey,
            wallet: ProjectOwnerWallet,
          })
        // More that 30 char for metadata//
      );
    });

    it("Project Creation 2 project with same createKey and same wallet", async () => {
      // create project 1 project
      const firstProjectOwnerKeypair = await generateFundedKeypair(connection);
      const firstProjectOwnerWallet = new Wallet(firstProjectOwnerKeypair);
      const firstProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: firstProjectCreateKey,
        wallet: firstProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // create 2 project

      await assert.rejects(() =>
        createProject({
          connection: connection,
          projectCreateKey: firstProjectCreateKey,
          wallet: firstProjectOwnerWallet,
          memo: "Some",
          metadata: "https://m.cubik.so/p/56789",
        })
      );
    });

    it("Project Creation 2 project with same createKey and diffrent wallet", async () => {
      // create project 1 project
      const firstProjectOwnerKeypair = await generateFundedKeypair(connection);
      const firstProjectOwnerWallet = new Wallet(firstProjectOwnerKeypair);
      const firstProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: firstProjectCreateKey,
        wallet: firstProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      const burnnerOwnerKeypair = await generateFundedKeypair(connection);
      const burrnnerWallet = new Wallet(burnnerOwnerKeypair);

      await assert.rejects(() =>
        createProject({
          connection: connection,
          projectCreateKey: firstProjectCreateKey,
          wallet: burrnnerWallet,
          memo: "Some",
          metadata: "https://m.cubik.so/p/1234",
        })
      );
    });
  });

  describe("Project Updation", () => {
    it("Project Updation ideal Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const receiver = web3.Keypair.generate();

      await program.methods
        .projectUpdate({
          metadata: "something",
          receiver: receiver.publicKey,
        })
        .accounts({
          creator: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });

    it("Project Updation Failed Due To The Length of the metadata is more then 30", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const ProjectCreateKey = generateKeypair();
      const FirstProjectTx = await createProject({
        connection: connection,
        projectCreateKey: ProjectCreateKey,
        wallet: ProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      const receiver = await generateFundedKeypair(connection);

      await assert.rejects(() =>
        updateProject({
          receiverKey: receiver,
          wallet: ProjectOwnerWallet,
          projectCreateKey: ProjectCreateKey,
          metaData: "https://m.cubik.so/p/52094835yeuhgjf69",
        })
      );
    });

    it("Project Updation Failed ProjectCreateKey is diffrent ", async () => {
      // create project 1 project
      const firstProjectOwnerKeypair = await generateFundedKeypair(connection);
      const firstProjectOwnerWallet = new Wallet(firstProjectOwnerKeypair);
      const firstProjectCreateKey = generateKeypair();
      await createProject({
        connection: connection,
        projectCreateKey: firstProjectCreateKey,
        wallet: firstProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // create 2 project

      const otherProjectOwnerKeypair = await generateFundedKeypair(connection);
      const otherProjectOwnerWallet = new Wallet(otherProjectOwnerKeypair);
      const otherProjectCreateKey = await generateFundedKeypair(connection);
      await createProject({
        connection: connection,
        projectCreateKey: otherProjectCreateKey,
        wallet: otherProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/56789",
      });

      // now we try to update the first project with the other project key
      const receiver = await generateFundedKeypair(connection);

      await assert.rejects(() =>
        updateProject({
          receiverKey: receiver,
          wallet: firstProjectOwnerWallet,
          projectCreateKey: otherProjectCreateKey,
          metaData: "https://m.cubik.so/p/569",
        })
      );
    });

    it("Project Update by the createkey not initlized", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);

      const burrnerCreateKey = await generateFundedKeypair(connection);
      const receiver = await generateFundedKeypair(connection);

      await assert.rejects(() =>
        updateProject({
          receiverKey: receiver,
          wallet: ProjectOwnerWallet,
          projectCreateKey: burrnerCreateKey,
          metaData: "https://m.cubik.so/p/345",
        })
      );
    });

    it("Project Updation Failed ProjectOwnerWallet is diffrent ", async () => {
      // create project 1 project
      const firstProjectOwnerKeypair = await generateFundedKeypair(connection);
      const firstProjectOwnerWallet = new Wallet(firstProjectOwnerKeypair);
      const firstProjectCreateKey = generateKeypair();
      const FirstProjectTx = await createProject({
        connection: connection,
        projectCreateKey: firstProjectCreateKey,
        wallet: firstProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/1234",
      });

      // create 2 project

      const otherProjectOwnerKeypair = await generateFundedKeypair(connection);
      const otherProjectOwnerWallet = new Wallet(otherProjectOwnerKeypair);
      const otherProjectCreateKey = await generateFundedKeypair(connection);
      const otherProjectTx = await createProject({
        connection: connection,
        projectCreateKey: otherProjectCreateKey,
        wallet: otherProjectOwnerWallet,
        memo: "Some",
        metadata: "https://m.cubik.so/p/56789",
      });

      // now we try to update the first project with the other project key
      const receiver = await generateFundedKeypair(connection);

      await assert.rejects(() =>
        updateProject({
          receiverKey: receiver,
          wallet: otherProjectOwnerWallet,
          projectCreateKey: firstProjectCreateKey,
          metaData: "https://m.cubik.so/p/916",
        })
      );
    });
  });

  describe("Project Close", () => {
    it("Project Close ideal Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      await program.methods
        .projectClose()
        .accounts({
          creator: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });

    it("Project Close Falied due to not matched creator key", async () => {
      const projectCreateKey = await generateFundedKeypair(connection);
      const wallet = new Wallet(keypair);

      await assert.rejects(() => closeProject({ projectCreateKey, wallet }));
    });

    it("Project Close Falied due to not matched wallet key", async () => {
      const projectOwnerKeypair = await generateFundedKeypair(connection);
      const projectOwnerWallet = new Wallet(projectOwnerKeypair);

      await assert.rejects(() =>
        closeProject({
          projectCreateKey: createKey,
          wallet: projectOwnerWallet,
        })
      );
    });
  });

  describe("Project Transfer", () => {
    it("Project Transfer ideal Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      // create new project first
      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const newProjectCreateKey = web3.Keypair.generate();

      await program.methods
        .projectCreate({
          memo: "some",
          metadata: "something",
        })
        .accounts({
          createKey: newProjectCreateKey.publicKey,
          multisig: getMultisigPDA(newProjectCreateKey.publicKey)[0],
          creator: wallet.publicKey,
          programConfigPda: programConfigPda,
          projectAccount: getProjectPDA(newProjectCreateKey.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          treasury: programConfig.treasury,
        })
        .signers([wallet.payer, newProjectCreateKey])
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      await program.methods
        .projectTransfer({ newCreator: createKey.publicKey })
        .accounts({
          creator: wallet.publicKey,
          projectAccount: getProjectPDA(newProjectCreateKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });

    it("Project Transfer Failed due to Wrong project creator key", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = await generateFundedKeypair(connection);

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const newProjectOwnerCreateKey = await generateFundedKeypair(connection);
      const burnnerCreateKey = await generateFundedKeypair(connection);

      await assert.rejects(() =>
        transferProject({
          newCreatorKey: newProjectOwnerCreateKey,
          projectCreateKey: burnnerCreateKey,
          wallet: ProjectOwnerWallet,
        })
      );
    });

    it("Project Transfer Failed Due To Wrong Wallet Passed As Authority", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = await generateFundedKeypair(connection);

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const newProjectOwnerCreateKey = await generateFundedKeypair(connection);
      const burnnerOwnerKey = await generateFundedKeypair(connection);
      const burnnerOwnerWallet = new Wallet(burnnerOwnerKey);

      await assert.rejects(() =>
        transferProject({
          newCreatorKey: newProjectOwnerCreateKey,
          projectCreateKey: projectCreateKey,
          wallet: burnnerOwnerWallet,
        })
      );
    });
  });

  describe("Project Tip SOL", () => {
    it("Project Tip SOL ideal Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const projectAccountPublicKey = getProjectPDA(createKey.publicKey)[0];
      const projectAccount = await program.account.project.fetch(
        projectAccountPublicKey
      );

      await program.methods
        .projectTipSol({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          receiver: projectAccount.receiver,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });

    it("Project Tip Failed Due To Wrong Reciver Create Key Which Dose Not Have Project", async () => {
      const sendKeypair = await generateFundedKeypair(connection);
      const senderWallet = new Wallet(sendKeypair);
      const burnnerCreateKey = await generateFundedKeypair(connection);

      await assert.rejects(() =>
        tipSOLProject({
          projectCreateKey: burnnerCreateKey,
          tipAmount: new BN(2),
          wallet: senderWallet,
        })
      );
    });
  });

  describe("Project Tip SPL", () => {
    it("Project Tip SPL ideal Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );

      const receiver = web3.Keypair.generate();

      const senderATA = getAssociatedTokenAddressSync(
        tokenMint,
        wallet.publicKey
      );
      const reciverATA = getAssociatedTokenAddressSync(
        tokenMint,
        receiver.publicKey,
        true
      );

      const tx = await program.methods
        .projectTipSpl({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
          tokenAtaReceiver: reciverATA,
          tokenAtaSender: senderATA,
          tokenMint: tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });

    it("Project Tip SPL Failed Due To no project created with that createKey", async () => {
      const sendKeypair = await generateFundedKeypair(connection);
      const senderWallet = new Wallet(sendKeypair);
      const burnnerCreateKey = await generateFundedKeypair(connection);
      const receiver = web3.Keypair.generate();
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );

      await assert.rejects(() =>
        tipSPLProject({
          projectCreateKey: burnnerCreateKey,
          tipAmount: new BN(2),
          receiver: receiver,
          tokenMint: tokenMint,
          wallet: senderWallet,
          signerWallet: senderWallet,
        })
      );
    });

    it("Project Tip SPL Failed Due To The Diffrent Wallet used for signed and senderATA is diffrents", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = await generateFundedKeypair(connection);

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const sendKeypair = await generateFundedKeypair(connection);
      const senderWallet = new Wallet(sendKeypair);
      const receiver = web3.Keypair.generate();
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );

      const burnnerKeypair = await generateFundedKeypair(connection);
      const burnnerWallet = new Wallet(burnnerKeypair);

      await assert.rejects(() =>
        tipSPLProject({
          projectCreateKey,
          receiver: receiver,
          tipAmount: new BN(2),
          tokenMint,
          wallet: senderWallet,
          signerWallet: burnnerWallet,
        })
      );
    });

    it("Project Tip SPL Failed Dute To The Wrong Token Address ", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = await generateFundedKeypair(connection);

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const sendKeypair = await generateFundedKeypair(connection);
      const senderWallet = new Wallet(sendKeypair);
      const receiver = web3.Keypair.generate();
      const tokenMint = new PublicKey("EPjFWdd");

      await assert.rejects(() =>
        tipSPLProject({
          projectCreateKey,
          receiver: receiver,
          tipAmount: new BN(2),
          tokenMint,
          wallet: senderWallet,
          signerWallet: senderWallet,
        })
      );
    });

    it("Project Tip SPL Failed Due To The Diffrent Wallet used for signed and senderATA is diffrents", async () => {
      const ProjectOwnerKeypair = await generateFundedKeypair(connection);
      const ProjectOwnerWallet = new Wallet(ProjectOwnerKeypair);
      const projectCreateKey = await generateFundedKeypair(connection);

      await createProject({
        connection,
        memo: "Some",
        metadata: "https://m.cubik.so/p/9753",
        projectCreateKey,
        wallet: ProjectOwnerWallet,
      });

      const sendKeypair = await generateFundedKeypair(connection);
      const senderWallet = new Wallet(sendKeypair);
      const receiver = web3.Keypair.generate();
      const tokenMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );

      const burnnerKeypair = await generateFundedKeypair(connection);
      const burnnerWallet = new Wallet(burnnerKeypair);

      await assert.rejects(() =>
        tipSPLProject({
          projectCreateKey,
          receiver: receiver,
          tipAmount: new BN(2),
          tokenMint,
          wallet: senderWallet,
          signerWallet: burnnerWallet,
        })
      );
    });
  });
});
