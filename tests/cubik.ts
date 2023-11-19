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

  // it('Is initialized!', async () => {
  //   const tx = await program.methods.initialize().rpc();
  //   console.log('Your transaction signature', tx);
  // });

  const keypair = fs.readFileSync(__dirname + '/../wallets.json');

  it('Create User', async () => {
    console.log(keypair);
    // const [userAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [Buffer.from('user'),],
    //   program.programId
    // );
    // const tx = await program.methods
    //   .createUser('username', 'admin')
    //   .accounts({
    //     userAccount: userAccount,
    //   })
    //   .rpc();
    // console.log('Your transaction signature', tx);
  });
  // it('Create User', async () => {
  //   const [] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from('user')],
  //     program.programId
  //   );
  //   const tx = await program.methods
  //     .createUser('username', 'dsadf')
  //     .accounts({
  //       userAccount: '',
  //     })
  //     .rpc();
  //   console.log('Your transaction signature', tx);
  // });
});
