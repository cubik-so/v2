import {
  adminKeypair,
  createCubikProgram,
  createDevnetConnection,
  generateFundedKeypair,
  generateKeypair,
  getProgramConfigPda,
  ProgramConfig,
  SEED_MULTISIG,
  SEED_PREFIX,
  SQUADS_PROGRAM_ID,
} from "../../utils";
import { Wallet, web3 } from "@coral-xyz/anchor";
import { getProjectPDA } from "../../pda";

const connection = createDevnetConnection();
describe("Project", () => {
  let keypair: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    keypair = adminKeypair;
  });

  describe("Starting Project Creation", () => {
    it("Create Project", async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);

      const [multisigPDA] = web3.PublicKey.findProgramAddressSync(
        [SEED_PREFIX, SEED_MULTISIG, createKey.publicKey.toBytes()],
        SQUADS_PROGRAM_ID
      );

      const programConfigPda = getProgramConfigPda({
        programId: SQUADS_PROGRAM_ID,
      })[0];

      const programConfig = await ProgramConfig.fromAccountAddress(
        connection,
        programConfigPda
      );
      console.log(wallet.publicKey.toBase58());
      const tx = await program.methods
        .projectCreate({ memo: "something", metadata: "some" })
        .accounts({
          createKey: createKey.publicKey,
          multisig: multisigPDA,
          creator: wallet.publicKey,
          programConfigPda: programConfigPda,
          projectAccount: getProjectPDA(createKey.publicKey, 0)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          treasury: programConfig.treasury,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer, createKey])
        .rpc({
          maxRetries: 3,
          commitment: "confirmed",
        });

      console.log(tx);
    });
  });
});
