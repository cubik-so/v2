use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use squads_multisig_program::{Member, Permission, Permissions, SEED_PREFIX, SEED_VAULT};

use crate::state::{Sponsor, SponsorTeam};
use crate::{event::*, Event, SubAdmin, User};

pub fn init_sponsor_with_self_custody_handler(
    ctx: Context<InitSponsorWithSelfCustodyContext>,
    total_committed: u128,
    members_keys: Vec<Pubkey>,
    threshold: u16,
    config_authority: Option<Pubkey>,
    time_lock: u32,
    memo: Option<String>,
) -> Result<()> {
    let sponsor_account = &mut ctx.accounts.sponsor_account;
    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;

    let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreate {
        create_key: ctx.accounts.create_key.to_account_info(), // this is example
        creator: ctx.accounts.authority.to_account_info(),
        multisig: ctx.accounts.multisig.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let cpi_ctx_squads = CpiContext::new(
        ctx.accounts.squads_program.to_account_info(),
        create_multisig,
    );
    let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

    let permission = Permissions::from_vec(&all_permissions);
    let (vault_pubkey, _vault_bump_seed) = Pubkey::find_program_address(
        &[
            SEED_PREFIX,
            &ctx.accounts.multisig.key().to_bytes(),
            SEED_VAULT,
            &[0],
        ],
        &squads_multisig_program::ID,
    );
    let members: Vec<Member> = members_keys
        .iter()
        .map(|key| Member {
            key: *key,
            permissions: permission,
        })
        .collect();

    squads_multisig_program::cpi::multisig_create(
        cpi_ctx_squads,
        squads_multisig_program::MultisigCreateArgs {
            config_authority,
            members,
            memo,
            threshold,
            time_lock,
        },
    )?;
    // sponsor account
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.create_key = ctx.accounts.create_key.key();
    sponsor_account.multi_sig = ctx.accounts.multisig.key();
    sponsor_account.event_account = ctx.accounts.event_account.key();
    sponsor_account.vault_pubkey = vault_pubkey.key();
    sponsor_account.bump = ctx.bumps.sponsor_account;
    // sponsor team  account
    sponsor_team_account.authority = ctx.accounts.authority.key();
    sponsor_team_account.bump = ctx.bumps.sponsor_team_account;

    // team account
    emit!(NewSponsor {
        authority: ctx.accounts.authority.key(),
        total_committed,
        event_account: ctx.accounts.event_account.key(),
    });

    Ok(())
}

pub fn init_sponsor_without_self_custody_handler(
    ctx: Context<InitSponsorWithoutSelfCustodyContext>,
    total_committed: u128,
) -> Result<()> {
    let sponsor_account = &mut ctx.accounts.sponsor_account;
    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;
    let cubik_sponsor_account = &mut ctx.accounts.cubik_sponsor;
    // sponsor account
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.create_key = ctx.accounts.create_key.key();
    sponsor_account.multi_sig = cubik_sponsor_account.multi_sig;
    sponsor_account.event_account = ctx.accounts.event_account.key();
    sponsor_account.vault_pubkey = cubik_sponsor_account.vault_pubkey;
    sponsor_account.bump = ctx.bumps.sponsor_account;
    // sponsor team  account
    sponsor_team_account.authority = ctx.accounts.authority.key();
    sponsor_team_account.bump = ctx.bumps.sponsor_team_account;

    // team account
    emit!(NewSponsor {
        authority: ctx.accounts.authority.key(),
        total_committed,
        event_account: ctx.accounts.event_account.key(),
    });

    Ok(())
}

pub fn init_cubik_sponsor_handler(
    ctx: Context<InitCubikSponsorContext>,
    total_committed: u128,
    members_keys: Vec<Pubkey>,
    threshold: u16,
    config_authority: Option<Pubkey>,
    time_lock: u32,
    memo: Option<String>,
) -> Result<()> {
    let sponsor_account = &mut ctx.accounts.sponsor_account;
    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;

    let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreate {
        create_key: ctx.accounts.create_key.to_account_info(), // this is example
        creator: ctx.accounts.authority.to_account_info(),
        multisig: ctx.accounts.multisig.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let cpi_ctx_squads = CpiContext::new(
        ctx.accounts.squads_program.to_account_info(),
        create_multisig,
    );
    let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

    let permission = Permissions::from_vec(&all_permissions);
    let (vault_pubkey, _vault_bump_seed) = Pubkey::find_program_address(
        &[
            SEED_PREFIX,
            &ctx.accounts.multisig.key().to_bytes(),
            SEED_VAULT,
            &[0],
        ],
        &squads_multisig_program::ID,
    );
    let members: Vec<Member> = members_keys
        .iter()
        .map(|key| Member {
            key: *key,
            permissions: permission,
        })
        .collect();

    squads_multisig_program::cpi::multisig_create(
        cpi_ctx_squads,
        squads_multisig_program::MultisigCreateArgs {
            config_authority,
            members,
            memo,
            threshold,
            time_lock,
        },
    )?;
    // sponsor account
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.create_key = ctx.accounts.create_key.key();
    sponsor_account.multi_sig = ctx.accounts.multisig.key();
    sponsor_account.event_account = ctx.accounts.event_account.key();
    sponsor_account.vault_pubkey = vault_pubkey.key();
    sponsor_account.bump = ctx.bumps.sponsor_account;
    // sponsor team  account
    sponsor_team_account.authority = ctx.accounts.authority.key();
    sponsor_team_account.bump = ctx.bumps.sponsor_team_account;

    // team account
    emit!(NewSponsor {
        authority: ctx.accounts.authority.key(),
        total_committed,
        event_account: ctx.accounts.event_account.key(),
    });

    Ok(())
}

pub fn add_member_sponsor_handler(
    ctx: Context<SponsorTeamContext>,
    team_member_key: Pubkey,
) -> Result<()> {
    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;
    sponsor_team_account.authority = team_member_key.key();
    sponsor_team_account.bump = ctx.bumps.sponsor_team_account;

    Ok(())
}

pub fn remove_member_sponsor_handler(
    _: Context<CloseSponsorTeamContext>,
    _team_member_key: Pubkey,
) -> Result<()> {
    Ok(())
}

pub fn fund_sponsor_sol_handler(ctx: Context<FundSponsorSol>, amount: u64) -> Result<()> {
    let sponsor_account = &ctx.accounts.sponsor_account;
    let receiver = &ctx.accounts.receiver;
    let transfer_instruction = system_instruction::transfer(
        ctx.accounts.authority.key,
        &sponsor_account.vault_pubkey,
        amount,
    );

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            ctx.accounts.authority.to_account_info(),
            receiver.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    emit!(NewFundSponsorSOL {
        authority: ctx.accounts.authority.key(),
        amount: amount,
    });

    Ok(())
}

pub fn fund_sponsor_spl_handler(ctx: Context<FundSponsorSpl>, amount: u64) -> Result<()> {
    let sender_ata = &ctx.accounts.token_ata_sender;
    let receiver_ata = &ctx.accounts.token_ata_receiver;

    let transfer_instruction = anchor_spl::token::Transfer {
        from: sender_ata.to_account_info(),
        to: receiver_ata.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    let cpi_ctx_trans = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );
    anchor_spl::token::transfer(cpi_ctx_trans, amount)?;

    emit!(NewFundSponsorSPL {
        authority: ctx.accounts.authority.key(),
        amount: amount,
        token: ctx.accounts.token_mint.key(),
    });
    Ok(())
}

#[derive(Accounts)]
pub struct InitSponsorWithoutSelfCustodyContext<'info> {
    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref()],
        bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref(),authority.key().as_ref()],
        bump
    )]
    pub sponsor_team_account: Box<Account<'info, SponsorTeam>>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),event_account.key().as_ref()],
        bump = cubik_sponsor.bump
    )]
    pub cubik_sponsor: Box<Account<'info, Sponsor>>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_account.event_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitSponsorWithSelfCustodyContext<'info> {
    #[account(mut,constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref()],
        bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,
    #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref(),authority.key().as_ref()],
        bump
    )]
    pub sponsor_team_account: Box<Account<'info, SponsorTeam>>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_account.event_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    /// CHECK: This is a CPI account
    #[account(mut)]
    pub multisig: UncheckedAccount<'info>,

    #[account(address = squads_multisig_program::ID)]
    pub squads_program: Program<'info, squads_multisig_program::program::SquadsMultisigProgram>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitCubikSponsorContext<'info> {
    #[account(mut,constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(mut,
        constraint = user_account.authority.key() == authority.key(),
        constraint = sub_admin_account.level >= 2,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(), event_account.key().as_ref()],
        bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,
    #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref(),authority.key().as_ref()],
        bump
    )]
    pub sponsor_team_account: Box<Account<'info, SponsorTeam>>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_account.event_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    /// CHECK: This is a CPI account
    #[account(mut)]
    pub multisig: UncheckedAccount<'info>,

    #[account(address = squads_multisig_program::ID)]
    pub squads_program: Program<'info, squads_multisig_program::program::SquadsMultisigProgram>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(team_member_key:Pubkey)]
pub struct SponsorTeamContext<'info> {
    // todo - In future move this authority to sponsor_team_account and add a type in sponsor team account of admin or member
    #[account(mut, constraint = sponsor_account.authority.key() == authority.key())]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref(),team_member_key.key().as_ref()],
        bump
    )]
    pub sponsor_team_account: Account<'info, SponsorTeam>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Account<'info, Sponsor>,

    #[account(mut,
        constraint = user_account.authority.key() == team_member_key.key(),
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Box<Account<'info, User>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(team_member_key:Pubkey)]
pub struct CloseSponsorTeamContext<'info> {
    // todo - In future move this authority to sponsor_team_account and add a type in sponsor team account of admin or member
    #[account(mut, constraint = sponsor_account.authority.key() == authority.key())]
    pub authority: Signer<'info>,

    #[account(mut,
        close = authority,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref(),team_member_key.key().as_ref()],
        bump= sponsor_team_account.bump
    )]
    pub sponsor_team_account: Box<Account<'info, SponsorTeam>>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Box<Account<'info, User>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FundSponsorSol<'info> {
    #[account(mut, constraint = sponsor_team_account.authority.key() == authority.key())]
    pub authority: Signer<'info>,

    /// CHECK: Receiver is the project vault
    #[account(mut, constraint = sponsor_account.vault_pubkey.key() == receiver.key())]
    pub receiver: AccountInfo<'info>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref(),sponsor_account.authority.key().as_ref()],
        bump= sponsor_team_account.bump
    )]
    pub sponsor_team_account: Box<Account<'info, SponsorTeam>>,
    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FundSponsorSpl<'info> {
    #[account(mut, constraint = sponsor_team_account.authority.key() == authority.key())]
    pub authority: Signer<'info>,

    #[account(mut, constraint = sponsor_team_account.authority.key() == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.owner.key() == sponsor_account.vault_pubkey.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref(),sponsor_account.authority.key().as_ref()],
        bump= sponsor_team_account.bump
    )]
    pub sponsor_team_account: Box<Account<'info, SponsorTeam>>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
