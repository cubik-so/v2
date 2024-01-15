use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use squads_multisig_program::{Member, Permission, Permissions};

use crate::event::*;
use crate::state::{Sponsor, SponsorTeam};

pub fn init_sponsor_handler(
    ctx: Context<InitSponsorContext>,
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
    sponsor_account.bump = *ctx.bumps.get("sponsor_account").unwrap();
    // sponsor team  account
    sponsor_team_account.authority = ctx.accounts.authority.key();
    sponsor_team_account.bump = *ctx.bumps.get("sponsor_team_account").unwrap();

    // team account
    emit!(NewSponsor {
        authority: ctx.accounts.authority.key(),
        total_committed,
    });

    Ok(())
}

pub fn add_member_sponsor_handler(
    ctx: Context<SponsorTeamContext>,
    team_member_key: Pubkey,
) -> Result<()> {
    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;
    sponsor_team_account.authority = team_member_key.key();
    sponsor_team_account.bump = *ctx.bumps.get("sponsor_team_account").unwrap();

    Ok(())
}

pub fn update_sponsor_handler(ctx: Context<UpdateSponsor>, total_committed: u64) -> Result<()> {
    let sponsor_account = &mut ctx.accounts.sponsor_account;
    // sponsor_account.total_committed_usd = total_committed;

    emit!(UpdateSponsorEvent {
        authority: ctx.accounts.authority.key(),
    });

    Ok(())
}

#[derive(Accounts)]
pub struct InitSponsorContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref()],
        bump
    )]
    pub sponsor_account: Account<'info, Sponsor>,
    #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),create_key.key().as_ref(),authority.key().as_ref()],
        bump
    )]
    pub sponsor_team_account: Account<'info, SponsorTeam>,

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
pub struct UpdateSponsor<'info> {
    #[account(mut, constraint = authority.key() == sponsor_team_account.authority.key())]
    pub authority: Signer<'info>,
    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref()],
        bump
    )]
    pub sponsor_account: Account<'info, Sponsor>,
    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.create_key.key().as_ref(),authority.key().as_ref()],
        bump
    )]
    pub sponsor_team_account: Account<'info, SponsorTeam>,
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

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
