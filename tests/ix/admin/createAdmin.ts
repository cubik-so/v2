import { Wallet, utils, web3 } from '@coral-xyz/anchor';
import {
  adminPair,
  createCubikProgram,
  createLocalhostConnection,
} from '../../utils';
import { getAdminPDA } from '../../pda';

console.log('createUser Test....');

const connection = createLocalhostConnection();

describe('Admin', () => {
  // it('Success: Create Admin', async () => {
  //   const admin = adminPair();
  //   console.log(utils.bytes.bs58.encode(admin.secretKey));
  //   console.log('---');
  //   console.log(admin.publicKey.toBase58());
  // });
  it('Success: Create Admin', async () => {
    const keypair = await adminPair();
    console.log(utils.bytes.bs58.encode(keypair.secretKey));
    console.log('-------------');
    console.log(utils.bytes.utf8.decode(keypair.secretKey));
    const wallet = new Wallet(keypair);
    const program = createCubikProgram(wallet);

    const tx = await program.methods
      .createAdmin()
      .accounts({
        authority: wallet.publicKey,
        adminAccount: getAdminPDA()[0],
      })
      .rpc();
    console.log(tx);
  });
});
