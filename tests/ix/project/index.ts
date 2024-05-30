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
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const connection = createDevnetConnection();
describe("Project", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Project Creation", () => {
    it("Project Creation Idel Flow", async () => {
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
    it("Project Updation Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const receiver = web3.Keypair.generate();

      const tx = await program.methods
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
      console.log(tx);
    });
  });

  describe("Project Close", () => {
    it("Project Close Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const tx = await program.methods
        .projectUpdate({
          metadata: "something",
          receiver: createKey.publicKey,
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
    it("Project Transfer Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
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
    it("Project Tip SOL Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const projectAccountPublicKey = getProjectPDA(createKey.publicKey)[0];
      const projectAccount = await program.account.project.fetch(
        projectAccountPublicKey
      );

      const tx = await program.methods
        .projectTipSol({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey)[0],
          receiver: projectAccount.receiver,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
      console.log(tx);
    });
  });

  describe("Project Tip SPL", () => {
    it("Project Tip SPL Idel Flow", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const tokenMint = new PublicKey("");

      const receiver = web3.Keypair.generate();

      const sernderATA = getAssociatedTokenAddressSync(
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
          tokenAtaSender: sernderATA,
          tokenMint: tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
      console.log(tx);
    });
  });
});
