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
  //   connection.requestAirdrop(admin.publicKey, 1 * web3.LAMPORTS_PER_SOL);
  // });
  it('Success: Create Admin', async () => {
    const keypair = adminPair();
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
