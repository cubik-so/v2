import { Wallet, web3 } from '@coral-xyz/anchor';
import {
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
    let keypair: web3.Keypair;
    before(async () => {
      keypair = await generateFundedKeypair(connection);
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
  describe('Username over length', () => {
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
