import { Wallet, web3 } from '@coral-xyz/anchor';
import {
  SEED_MULTISIG,
  SEED_PREFIX,
  SQUADS_PROGRAM_ID,
  createCubikProgram,
  createLocalhostConnection,
  generateFundedKeypair,
  generateKeypair,
} from '../../utils';
import { getProjectPDA, getUserPDA } from '../../pda';
import { BN } from 'bn.js';

console.log('createProject Test....');

const connection = createLocalhostConnection();
describe('Project', () => {
  const username = 'TestUser';
  let keypair: web3.Keypair;
  const counter = 0;
  const createKey = generateKeypair();
  before(async () => {
    keypair = await generateFundedKeypair(connection);
  });
  describe('Create Project Full', () => {
    it('Success: Test User', async () => {
      const wallet = new Wallet(keypair);
      const program = createCubikProgram(wallet);
      const tx = await program.methods
        .createUser(username)
        .accounts({
          authority: wallet.publicKey,
          userAccount: getUserPDA(wallet.publicKey)[0],
        })
        .rpc({
          commitment: 'confirmed',
          maxRetries: 3,
        });

      console.log(tx);
    });

    it('Success: Create Project - 1', async () => {
      const wallet = new Wallet(keypair);
      const signer2 = generateKeypair();
      const program = createCubikProgram(wallet);
      const [multisigPDA] = web3.PublicKey.findProgramAddressSync(
        [SEED_PREFIX, SEED_MULTISIG, createKey.publicKey.toBytes()],
        SQUADS_PROGRAM_ID
      );
      const tx = await program.methods
        .createProject(
          new BN(counter),
          [wallet.publicKey, signer2.publicKey],
          2,
          signer2.publicKey,
          0,
          '{}'
        )
        .accounts({
          createKey: createKey.publicKey,
          owner: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey, counter)[0],
          userAccount: getUserPDA(wallet.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          multisig: multisigPDA,
        })
        .signers([createKey])
        .rpc({
          commitment: 'confirmed',
          maxRetries: 3,
        });

      console.log(tx);
    });
    it('Success: Create Project - 2', async () => {
      const wallet = new Wallet(keypair);
      const signer2 = generateKeypair();
      const program = createCubikProgram(wallet);
      const [multisigPDA] = web3.PublicKey.findProgramAddressSync(
        [SEED_PREFIX, SEED_MULTISIG, createKey.publicKey.toBytes()],
        SQUADS_PROGRAM_ID
      );
      const tx = await program.methods
        .createProject(
          new BN(counter + 1),
          [wallet.publicKey, signer2.publicKey],
          2,
          signer2.publicKey,
          0,
          '{}'
        )
        .accounts({
          createKey: createKey.publicKey,
          owner: wallet.publicKey,
          projectAccount: getProjectPDA(createKey.publicKey, counter + 1)[0],
          userAccount: getUserPDA(wallet.publicKey)[0],
          squadsProgram: SQUADS_PROGRAM_ID,
          multisig: multisigPDA,
        })
        .signers([createKey])
        .rpc({
          commitment: 'confirmed',
          maxRetries: 3,
        });

      console.log(tx);
    });
  });
  describe('Change Status', () => {
    it('Success: Change Status Verified', async () => {});
    it('Success: Change Status Rejected', async () => {});
  });
});
