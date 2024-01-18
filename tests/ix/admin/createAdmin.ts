import { Wallet, web3 } from '@coral-xyz/anchor';
import {
  createCubikProgram,
  createLocalhostConnection,
  generateFundedKeypair,
} from '../../utils';
import { getAdminPDA } from '../../pda';

console.log('createUser Test....');

const connection = createLocalhostConnection();

describe('Admin', () => {
  let keypair: web3.Keypair;
  before(async () => {
    keypair = await generateFundedKeypair(connection);
  });
  it('Success: Create Admin', async () => {
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    const tx = await program.methods
      .createAdmin()
      .accounts({
        authority: wallet.publicKey,
        adminAccount: getAdminPDA()[0],
      })
      .rpc();

    tx;
  });
});
