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
} from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { PublicKey } from "@solana/web3.js";

const connection = createDevnetConnection();
describe("Project", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Project Creation", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Project Creation Idel Flow", async () => {
      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );

      const tx = await program.methods
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
      console.log(tx);
    });
  });
  describe("Project Updation", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Project Updation Idel Flow", async () => {
      const tx = await program.methods
        .projectUpdate({
          metadata: "something",
          reciver: createKey.publicKey,
        })
        .accounts({
          creator: createKey.publicKey,
          projectAccount: getMultisigPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });
      console.log(tx);
    });
  });
  describe("Project Close", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Project Close Idel Flow", async () => {
      const tx = await program.methods
        .projectUpdate({
          metadata: "something",
          reciver: createKey.publicKey,
        })
        .accounts({
          creator: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
  describe("Project Transfer", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Project Transfer Idel Flow", async () => {
      const tx = await program.methods
        .projectTransfer({ newCreator: createKey.publicKey })
        .accounts({
          creator: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ maxRetries: 3, commitment: "confirmed" });

      console.log(tx);
    });
  });
  describe("Project Tip SOL", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Project Tip SOL Idel Flow", async () => {
      const projectAccount = await program.account.project.fetch(
        createKey.publicKey
      );
      const tx = await program.methods
        .projectTipSol({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          receiver: projectAccount.reciver,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
      console.log(tx);
    });
  });

  describe("Project Tip SPL", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Project Tip SPL Idel Flow", async () => {
      const tokenMint = new PublicKey("");
      const tokenAtaSender = new PublicKey("");
      const tokenAtaReceiver = new PublicKey("");

      const tx = await program.methods
        .projectTipSpl({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          systemProgram: web3.SystemProgram.programId,
          tokenAtaReceiver: tokenAtaReceiver,
          tokenAtaSender: tokenAtaSender,
          tokenMint: tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
      console.log(tx);
    });
  });
});
