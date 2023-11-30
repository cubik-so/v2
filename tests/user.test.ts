import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Cubik, IDL } from '../target/types/cubik';
import fs from 'fs';

describe('cubik_v2', () => {
  anchor.setProvider(
    anchor.AnchorProvider.local('https://api.devnet.solana.com', {
      commitment: 'confirmed',
    })
  );

  const program = anchor.workspace.Cubik as Program<Cubik>;
  const Keypair = anchor.web3.Keypair.fromSecretKey(
    anchor.utils.bytes.bs58.decode('')
  );
  const newKeypair = anchor.web3.Keypair.generate();
  console.log(newKeypair.publicKey.toBase58());
  it.skip('create tester', async () => {
    const ix = anchor.web3.SystemProgram.transfer({
      fromPubkey: Keypair.publicKey,
      toPubkey: newKeypair.publicKey,
      lamports: anchor.web3.LAMPORTS_PER_SOL * 0.001,
    });
    const tx = new anchor.web3.Transaction();
    tx.add(ix);
    tx.feePayer = Keypair.publicKey;
    const { blockhash } =
      await program.provider.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.partialSign(Keypair);
    const sig = await program.provider.connection.sendRawTransaction(
      tx.serialize(),
      {
        preflightCommitment: 'finalized',
      }
    );
    console.log(sig, '==');
    await Promise.resolve(() =>
      setTimeout(() => {
        return null;
      }, 200000)
    );
  });
  it('create user', async () => {
    const [userAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('user'), Keypair.publicKey.toBuffer()],
      program.programId
    );
    const ix = await program.methods
      .createUser('username', 'admin')
      .accounts({
        userAccount: userAccount,
        authority: Keypair.publicKey,
      })
      .instruction();
    const tx = new anchor.web3.Transaction();
    tx.add(ix);
    tx.feePayer = Keypair.publicKey;
    const { blockhash } =
      await program.provider.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.partialSign(Keypair);
    const sig = await program.provider.connection.sendRawTransaction(
      tx.serialize()
    );
    console.log(sig, '----');
  });
});
