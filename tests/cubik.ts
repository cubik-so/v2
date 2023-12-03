import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cubik, IDL } from "../target/types/cubik";

describe("cubik_v2", () => {
  anchor.setProvider(
    anchor.AnchorProvider.local("https://api.devnet.solana.com", {
      commitment: "confirmed",
    })
  );

  const program = anchor.workspace.Cubik as Program<Cubik>;

  // it('Is initialized!', async () => {
  //   const tx = await program.methods.initialize().rpc();
  //   console.log('Your transaction signature', tx);
  // });

  // const keypair = fs.readFileSync(__dirname + '/../wallets.json');
});
