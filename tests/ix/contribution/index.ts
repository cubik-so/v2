import { BN } from "bn.js";
import { generateKeypair, adminKeypair, createCubikProgram } from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";
import { getEventPDA, getEventParticipantPDA, getProjectPDA } from "../../pda";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { PublicKey } from "@solana/web3.js";

describe("Contribution", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Contribution SPL", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Contribution SPL Idel Case", async () => {
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccount = getProjectPDA(createKey.publicKey)[0];

      // TODO : Mint Address
      const tokenMint = new PublicKey("");
      const tokenAtaSender = new PublicKey("");
      const tokenAtaReceiver = new PublicKey("");

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
  describe("Contribution SOL", () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    it("Contributaion SOL Idel Case", async () => {
      const eventAccount = getEventPDA(createKey.publicKey)[0];
      const projectAccountPDA = getProjectPDA(createKey.publicKey)[0];

      const projectAccount = await program.account.project.fetch(
        createKey.publicKey
      );
      const tx = await program.methods
        .contributionSol({ amount: new BN(2) })
        .accounts({
          authority: wallet.publicKey,
          eventAccount: getEventPDA(createKey.publicKey)[0],
          eventParticipantAccount: getEventParticipantPDA(
            eventAccount,
            projectAccountPDA
          )[0],
          projectAccount: projectAccountPDA,
          receiver: projectAccount.reciver,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc({ maxRetries: 3, commitment: "confirmed" });
    });
  });
});
