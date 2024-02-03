import { Wallet, utils, web3, BN } from '@coral-xyz/anchor';
import {
  adminPair,
  createCubikProgram,
  createLocalhostConnection,
} from '../../utils';
import { getAdminPDA, getAdminSubAdminPDA, getUserPDA } from '../../pda';

describe('Event', () => {
  const keypair = adminPair();
  const wallet = new Wallet(keypair);
  const createKey = web3.Keypair.generate();
  it('Success: Create Event', async () => {
    const program = createCubikProgram(wallet);

    const [eventPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('event'), createKey.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .createEvent(new BN(10000))
      .accounts({
        eventAccount: eventPDA, //
        eventKey: createKey.publicKey,
        userAccount: getUserPDA(wallet.publicKey)[0],
        authority: wallet.publicKey,
        subAdminAccount: getAdminSubAdminPDA(
          wallet.publicKey,
          new web3.PublicKey('GYYhdDwHapYe4xPjHoMRa4QBkLmacBjSxBW3ZFmjhWch')
        )[0],
      })
      .signers([createKey])
      .rpc();
    console.log(tx);
  });
  after(async () => {
    console.log('SubAdmin Account....');

    const program = createCubikProgram(wallet);

    const subAdminAccount = await program.account.subAdmin.fetch(
      getAdminSubAdminPDA(
        keypair.publicKey,
        new web3.PublicKey('GYYhdDwHapYe4xPjHoMRa4QBkLmacBjSxBW3ZFmjhWch')
      )[0]
    );
    console.log(subAdminAccount);
  });
});
