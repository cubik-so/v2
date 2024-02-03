import { Wallet, web3 } from '@coral-xyz/anchor';
import {
  adminPair,
  createCubikProgram,
  createLocalhostConnection,
  generateFundedKeypair,
} from '../../utils';
import { getUserPDA } from '../../pda';

console.log('createUser Test....');

const connection = createLocalhostConnection();
describe('User', () => {
  describe('Username under length', () => {
    const username = 'loremlorem';
    // let keypair: web3.Keypair;
    const keypair = adminPair();
    before(async () => {
      const tx = await connection.requestAirdrop(
        keypair.publicKey,
        1 * web3.LAMPORTS_PER_SOL
      );
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: tx,
      });
    });

    it('Success: username char limit', async () => {
      const wallet = new Wallet(keypair);
      console.log(wallet.publicKey, '--pubkey--');
      const program = createCubikProgram(wallet);
      const tx = await program.methods
        .createUser(username)
        .accounts({
          authority: wallet.publicKey,
          userAccount: getUserPDA(wallet.publicKey)[0],
        })
        .rpc();

      console.log(tx);
    });
  });
  describe.skip('Username over length', () => {
    const username =
      'loremloremasdfhjkadfjkskjhasdfkhjdfakjskhjasdfkkhjakdfhskjhdfskjhkhjfdskhjfsadkhjkhjfadskhjfdsakhjdfaskhjkfsdahkjhafsdhkjasfdjkhfdsakhjjkhasdhklf';
    let keypair: web3.Keypair;
    before(async () => {
      keypair = await generateFundedKeypair(connection);
    });

    it('Error: username char over limit', async () => {
      const wallet = new Wallet(keypair);
      console.log(wallet.publicKey, '--pubkey--');
      const program = createCubikProgram(wallet);
      const tx = await program.methods
        .createUser(username)
        .accounts({
          authority: wallet.publicKey,
          userAccount: getUserPDA(wallet.publicKey)[0],
        })
        .rpc();

      console.log(tx);
    });
  });
});
