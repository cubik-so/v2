import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { V2 } from "../target/types/v2";

describe("v2", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.V2 as Program<V2>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
