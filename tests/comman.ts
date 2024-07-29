import { Program, Wallet, web3 } from "@coral-xyz/anchor";
import {
  getEventParticipantPDA,
  getEventPDA,
  getEventTeamPDA,
  getMultisigPDA,
  getProjectPDA,
  getSponsorPDA,
} from "./pda";
import BN from "bn.js";
import {
  createCubikProgram,
  getProgramConfigPda,
  ProgramConfig,
  SQUADS_PROGRAM_ID,
} from "./utils";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

//tip, contribute SOL

// create project function

export async function createProject({
  connection,
  projectCreateKey,
  wallet,
  memo = "memo",
  metadata = "metaData",
}: {
  connection: web3.Connection;
  projectCreateKey: web3.Keypair;
  wallet: Wallet;
  memo: string;
  metadata: string;
}) {
  const program = createCubikProgram(wallet);
  const programConfigPda = getProgramConfigPda({
    programId: SQUADS_PROGRAM_ID,
  })[0];

  const programConfig = await ProgramConfig.fromAccountAddress(
    connection,
    programConfigPda
  );

  const tx = await program.methods
    .projectCreate({
      memo: memo,
      metadata: metadata,
    })
    .accounts({
      createKey: projectCreateKey.publicKey,
      multisig: getMultisigPDA(projectCreateKey.publicKey)[0],
      creator: wallet.publicKey,
      programConfigPda: programConfigPda,
      projectAccount: getProjectPDA(projectCreateKey.publicKey)[0],
      squadsProgram: SQUADS_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      treasury: programConfig.treasury,
    })
    .signers([wallet.payer, projectCreateKey])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// update project function
export async function updateProject({
  receiverKey,
  wallet,
  projectCreateKey,
  metaData,
}: {
  receiverKey: web3.Keypair;
  wallet: Wallet;
  projectCreateKey: web3.Keypair;
  metaData: string;
}) {
  const program = createCubikProgram(wallet);

  const tx = await program.methods
    .projectUpdate({
      metadata: metaData,
      receiver: receiverKey.publicKey,
    })
    .accounts({
      creator: wallet.publicKey,
      projectAccount: getProjectPDA(projectCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc({ maxRetries: 3, commitment: "confirmed" });
  return tx;
}

// close project function

export async function closeProject({
  wallet,
  projectCreateKey,
}: {
  wallet: Wallet;
  projectCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const tx = await program.methods
    .projectClose()
    .accounts({
      creator: wallet.publicKey,
      projectAccount: getProjectPDA(projectCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// transfer project function

export async function transferProject({
  wallet,
  newCreatorKey,
  projectCreateKey,
}: {
  wallet: Wallet;
  newCreatorKey: web3.Keypair;
  projectCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const tx = await program.methods
    .projectTransfer({ newCreator: newCreatorKey.publicKey })
    .accounts({
      creator: wallet.publicKey,
      projectAccount: getProjectPDA(projectCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// tip sol project function

export async function tipSOLProject({
  wallet,
  projectCreateKey,
  tipAmount,
}: {
  wallet: Wallet;
  projectCreateKey: web3.Keypair;
  tipAmount: BN;
}) {
  const program = createCubikProgram(wallet);

  const projectAccountPublicKey = getProjectPDA(projectCreateKey.publicKey)[0];
  const projectAccount = await program.account.project.fetch(
    projectAccountPublicKey
  );
  const tx = await program.methods
    .projectTipSol({ amount: tipAmount })
    .accounts({
      authority: wallet.publicKey,
      projectAccount: getProjectPDA(projectCreateKey.publicKey)[0],
      receiver: projectAccount.receiver,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// tip spl project function

export async function tipSPLProject({
  wallet,
  projectCreateKey,
  tipAmount = new BN(2),
  tokenMint,
  receiver,
  signerWallet,
}: {
  wallet: Wallet;
  projectCreateKey: web3.Keypair;
  tipAmount: BN;
  tokenMint: web3.PublicKey;
  receiver: web3.Keypair;
  signerWallet: Wallet;
}) {
  const program = createCubikProgram(wallet);
  const senderATA = getAssociatedTokenAddressSync(tokenMint, wallet.publicKey);
  const reciverATA = getAssociatedTokenAddressSync(
    tokenMint,
    receiver.publicKey,
    true
  );

  const tx = await program.methods
    .projectTipSpl({ amount: tipAmount })
    .accounts({
      authority: wallet.publicKey,
      projectAccount: getProjectPDA(projectCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
      tokenAtaReceiver: reciverATA,
      tokenAtaSender: senderATA,
      tokenMint: tokenMint,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([signerWallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Create Event Function
export async function createEvent({
  connection,
  eventCreateKey,
  wallet,
  memo = "memo",
  metadata = "metaData",
  eventEndingSlot,
  eventStartingSlot,
}: {
  connection: web3.Connection;
  eventCreateKey: web3.Keypair;
  wallet: Wallet;
  memo: string;
  metadata: string;
  eventEndingSlot: BN;
  eventStartingSlot: BN;
}) {
  const program = createCubikProgram(wallet);
  const programConfigPda = getProgramConfigPda({
    programId: SQUADS_PROGRAM_ID,
  })[0];

  const programConfig = await ProgramConfig.fromAccountAddress(
    connection,
    programConfigPda
  );

  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const eventTeamAccount = getEventTeamPDA(eventAccount, wallet.publicKey)[0];

  const tx = await program.methods
    .eventCreate({
      memo: memo,
      metadata: metadata,
      endingSlot: eventEndingSlot,
      startSlot: eventStartingSlot,
    })
    .accounts({
      authority: wallet.publicKey,
      createKey: eventCreateKey.publicKey,
      multisig: getMultisigPDA(eventCreateKey.publicKey)[0],
      eventAccount: eventAccount,
      eventTeamAccount: eventTeamAccount,
      programConfigPda: programConfigPda,
      squadsProgram: SQUADS_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      treasury: programConfig.treasury,
    })
    .signers([wallet.payer, eventCreateKey])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Update Event Function
export async function updateEvent({
  wallet,
  eventCreateKey,
  metaData,
  eventEndingSlot,
  eventStartingSlot,
}: {
  wallet: Wallet;
  eventCreateKey: web3.Keypair;
  metaData: string;
  eventEndingSlot: BN;
  eventStartingSlot: BN;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const eventTeamAccount = getEventTeamPDA(eventAccount, wallet.publicKey)[0];
  const tx = await program.methods
    .eventUpdate({
      metadata: metaData,
      endingSlot: eventEndingSlot,
      startSlot: eventStartingSlot,
    })
    .accounts({
      authority: wallet.publicKey,
      eventAccount: eventAccount,
      eventTeamAccount: eventTeamAccount,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Create Event Team Funciton
export async function createEventTeam({
  eventCreateKey,
  wallet,
  teamMember,
}: {
  eventCreateKey: web3.Keypair;
  wallet: Wallet;
  teamMember: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];

  const eventTeamAccount = getEventTeamPDA(eventAccount, wallet.publicKey)[0];

  const newEventTeamAccount = getEventTeamPDA(
    eventAccount,
    teamMember.publicKey
  )[0];

  const tx = await program.methods
    .eventTeamCreate({
      newTeamMember: teamMember.publicKey,
    })
    .accounts({
      authority: wallet.publicKey,
      eventAccount: eventAccount,
      eventTeamAccount: eventTeamAccount,
      newEventTeamAccount: newEventTeamAccount,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Close Event Team Function

export async function closeEventTeam({
  wallet,
  eventCreateKey,
  eventTeamMemberKey,
}: {
  wallet: Wallet;
  eventCreateKey: web3.Keypair;
  eventTeamMemberKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const toCloseEventTeamAccount = getEventTeamPDA(
    eventAccount,
    eventTeamMemberKey.publicKey
  )[0];

  const tx = await program.methods
    .eventTeamClose()
    .accounts({
      authority: wallet.publicKey,
      eventAccount: eventAccount,
      toCloseEventTeamAccount: toCloseEventTeamAccount,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Create Event Participant Function

export async function createEventParticipant({
  projectCreateKey,
  eventCreateKey,
  wallet,
  authorityWallet,
}: {
  projectCreateKey: web3.Keypair;
  eventCreateKey: web3.Keypair;
  wallet: Wallet;
  authorityWallet: Wallet;
}) {
  const program = createCubikProgram(wallet);
  const projectAccount = getProjectPDA(projectCreateKey.publicKey)[0];
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];

  const tx = await program.methods
    .eventParticipantCreate()
    .accounts({
      authority: authorityWallet.publicKey,
      eventAccount: eventAccount,
      eventParticipantAccount: getEventParticipantPDA(
        eventAccount,
        projectAccount
      )[0],
      projectAccount: projectAccount,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Update Event Participant fucntion

export async function updateEventParticipant({
  wallet,
  eventCreateKey,
  projectCreateKey,
}: {
  wallet: Wallet;
  eventCreateKey: web3.Keypair;
  projectCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const projectAccount = getProjectPDA(projectCreateKey.publicKey)[0];

  const eventTeamAccount = getEventTeamPDA(eventAccount, wallet.publicKey)[0];

  const tx = await program.methods
    .eventParticipantUpdate({
      status: {
        approved: {},
      },
    })
    .accounts({
      eventAccount: eventAccount,
      eventParticipantAccount: getEventParticipantPDA(
        eventAccount,
        projectAccount
      )[0],
      eventTeamAccount: eventTeamAccount,
      projectAccount: projectAccount,
      systemProgram: web3.SystemProgram.programId,
      team: wallet.publicKey,
    })
    .signers([wallet.payer])
    .rpc({
      maxRetries: 3,
      commitment: "confirmed",
    });

  return tx;
}

// Invite Event Participant fucntion

export async function inviteEventParticipant({
  wallet,
  eventCreateKey,
  projectCreateKey,
}: {
  wallet: Wallet;
  eventCreateKey: web3.Keypair;
  projectCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const projectAccount = getProjectPDA(projectCreateKey.publicKey)[0];

  const eventTeamAccount = getEventTeamPDA(eventAccount, wallet.publicKey)[0];

  const tx = await program.methods
    .eventParticipantInvite()
    .accounts({
      eventAccount: eventAccount,
      eventParticipantAccount: getEventParticipantPDA(
        eventAccount,
        projectAccount
      )[0],
      eventTeamAccount: eventTeamAccount,
      projectAccount: projectAccount,
      team: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// SPL Contribution

export async function contributionSpl({
  wallet,
  eventCreateKey,
  projectCreateKey,
  contributedAmount = new BN(2),
  tokenMint,
  contributionCreateKey,
  authoirtyWallet,
}: {
  wallet: Wallet;
  eventCreateKey: web3.Keypair;
  projectCreateKey: web3.Keypair;
  contributedAmount: BN;
  tokenMint: web3.PublicKey;
  contributionCreateKey: web3.Keypair;
  authoirtyWallet: Wallet;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const projectAccount = getProjectPDA(projectCreateKey.publicKey)[0];

  const sernderATA = getAssociatedTokenAddressSync(tokenMint, wallet.publicKey);
  const reciverATA = getAssociatedTokenAddressSync(
    tokenMint,
    contributionCreateKey.publicKey,
    true
  );

  const tx = await program.methods
    .contributionSpl({ amount: contributedAmount })
    .accounts({
      authority: authoirtyWallet.publicKey,
      eventAccount: eventAccount,
      eventParticipantAccount: getEventParticipantPDA(
        eventAccount,
        projectAccount
      )[0],
      projectAccount: projectAccount,
      systemProgram: web3.SystemProgram.programId,
      tokenAtaReceiver: reciverATA,
      tokenAtaSender: sernderATA,
      tokenMint: tokenMint,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// SOL Contribution

export async function contributionSol({
  wallet,
  eventCreateKey,
  projectCreateKey,
}: {
  wallet: Wallet;
  eventCreateKey: web3.Keypair;
  projectCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const projectPda = getProjectPDA(projectCreateKey.publicKey)[0];

  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];
  const eventParticipantAccount = getEventParticipantPDA(
    eventAccount,
    projectPda
  )[0];

  const projectAccountPDA = getProjectPDA(projectCreateKey.publicKey)[0];
  let projectAccountKey = await program.account.project.fetch(
    projectAccountPDA
  );

  const tx = await program.methods
    .contributionSol({ amount: new BN(2) })
    .accounts({
      authority: wallet.publicKey,
      eventAccount: eventAccount,
      eventParticipantAccount: eventParticipantAccount,
      projectAccount: projectAccountPDA,
      receiver: projectAccountKey.receiver,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Create Sponsor Fucntion

export async function createSponser({
  wallet,
  sponserCreateKey,
  eventCreateKey,
}: {
  wallet: Wallet;
  sponserCreateKey: web3.Keypair;
  eventCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const eventAccount = getEventPDA(eventCreateKey.publicKey)[0];

  const tx = await program.methods
    .sponsorCreate({ metadata: "something" })
    .accounts({
      authority: wallet.publicKey,
      createKey: sponserCreateKey.publicKey,
      eventAccount: eventAccount,
      sponsorAccount: getSponsorPDA(sponserCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer, sponserCreateKey])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Create Custoday for Sponsor funciton

export async function createSponserCustody({
  wallet,
  sponserCreateKey,
  eventCreateKey,
  connection,
}: {
  wallet: Wallet;
  sponserCreateKey: web3.Keypair;
  eventCreateKey: web3.Keypair;
  connection: web3.Connection;
}) {
  const program = createCubikProgram(wallet);

  const programConfigPda = getProgramConfigPda({
    programId: SQUADS_PROGRAM_ID,
  })[0];

  const programConfig = await ProgramConfig.fromAccountAddress(
    connection,
    programConfigPda
  );
  const tx = await program.methods
    .sponsorCreateCustody({
      member: sponserCreateKey.publicKey,
      memo: "some",
      metadata: "Something",
    })
    .accounts({
      authority: wallet.publicKey,
      createKey: sponserCreateKey.publicKey,
      eventAccount: getEventPDA(eventCreateKey.publicKey)[0],
      multisig: getMultisigPDA(sponserCreateKey.publicKey)[0],
      programConfigPda: programConfigPda,
      sponsorAccount: getSponsorPDA(sponserCreateKey.publicKey)[0],
      squadsProgram: SQUADS_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      treasury: programConfig.treasury,
    })
    .signers([wallet.payer, sponserCreateKey])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Update Sponsor function

export async function updateSponser({
  wallet,
  sponserCreateKey,
}: {
  wallet: Wallet;
  sponserCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const tx = await program.methods
    .sponsorUpdate({ metadata: "something" })
    .accounts({
      authority: wallet.publicKey,
      sponsorAccount: getSponsorPDA(sponserCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}

// Close Sponsor function

export async function closeSponser({
  wallet,
  sponserCreateKey,
}: {
  wallet: Wallet;
  sponserCreateKey: web3.Keypair;
}) {
  const program = createCubikProgram(wallet);
  const tx = await program.methods
    .sponsorClose()
    .accounts({
      authority: wallet.publicKey,
      sponsorAccount: getSponsorPDA(sponserCreateKey.publicKey)[0],
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([wallet.payer])
    .rpc({ maxRetries: 3, commitment: "confirmed" });

  return tx;
}
