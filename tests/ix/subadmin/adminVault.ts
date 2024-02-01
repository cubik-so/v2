import { Wallet, web3 } from '@coral-xyz/anchor';
import {
  PROGRAM_ID,
  SEED_MULTISIG,
  SEED_PREFIX,
  SQUADS_PROGRAM_ID,
  adminPair,
  createCubikProgram,
  createLocalhostConnection,
  generateFundedKeypair,
  generateKeypair,
} from '../../utils';
import { getAdminPDA, getAdminSubAdminPDA } from '../../pda';

describe('vault admin', () => {
  const admin = adminPair();
  const adminCreateKey = new web3.PublicKey(
    '57VBxfhAcB5cAe6ejo7rfrvmtVjtziwA7VbbxK1gNQkr'
  );
  const connection = createLocalhostConnection();
  let newSubAdmin: web3.Keypair;
  const createKey = generateKeypair();
  before(async () => {
    newSubAdmin = await generateFundedKeypair(connection);
    // admin = await generateFundedKeypair(connection);
  });
  it.skip('SubAdmin level 3', async () => {
    const wallet = new Wallet(admin);
    const program = createCubikProgram(wallet);
    const tx = await program.methods
      .createSubAdmin(newSubAdmin.publicKey, 3)
      .accounts({
        authority: admin.publicKey,
        adminAccount: getAdminPDA()[0],
        subAdminAccount: getAdminSubAdminPDA(
          newSubAdmin.publicKey,
          createKey.publicKey
        )[0],
        createKey: createKey.publicKey,
      })
      .signers([createKey])
      .rpc();
    console.log(createKey.publicKey.toBase58());

    console.log(tx);
  });
  it.skip('Admin Vault', async () => {
    const wallet = new Wallet(newSubAdmin);
    const createKey2 = generateKeypair();
    const program = createCubikProgram(wallet);
    const subAdminPDA = getAdminSubAdminPDA(
      newSubAdmin.publicKey,
      createKey.publicKey
    )[0];
    const vaultPDA = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('admin'), Buffer.from('vault')],
      program.programId
    )[0];

    const [multisigPDA] = web3.PublicKey.findProgramAddressSync(
      [SEED_PREFIX, SEED_MULTISIG, createKey2.publicKey.toBytes()],
      SQUADS_PROGRAM_ID
    );

    const tx = await program.methods
      .createAdminVault(
        [
          generateKeypair().publicKey,
          generateKeypair().publicKey,
          generateKeypair().publicKey,
        ],
        '{}'
      )
      .accounts({
        adminVault: vaultPDA,
        multisig: multisigPDA,
        authority: newSubAdmin.publicKey,
        createKey: createKey2.publicKey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        subAdminAccount: subAdminPDA,
        squadsProgram: SQUADS_PROGRAM_ID,
      })
      .signers([createKey2])
      .rpc({
        commitment: 'confirmed',
        maxRetries: 3,
      });
    console.log(tx);
  });

  after(async () => {
    const wallet = new Wallet(newSubAdmin);

    const program = createCubikProgram(wallet);
    const vaultPDA = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('admin'), Buffer.from('vault')],
      program.programId
    )[0];

    const subAdminAccount = await program.account.adminVault.fetch(vaultPDA);
    console.log(subAdminAccount);
  });
});
