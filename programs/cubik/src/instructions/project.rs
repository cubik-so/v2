use std::vec;

use crate::errors::Errors;
use crate::event::{NewProject, UpdateProjectStatus};
use crate::state::{Project, ProjectVerification, SubAdmin, User};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use squads_multisig_program::{Member, Permission, Permissions, SEED_PREFIX, SEED_VAULT};

pub fn create_project_handler(
    ctx: Context<CreateProjectContext>,
    counter: u64,
    members_keys: Vec<Pubkey>,
    threshold: u16,
    config_authority: Option<Pubkey>,
    time_lock: u32,
    memo: Option<String>,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    let user_account = &mut ctx.accounts.user_account;

    let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreateV2 {
        program_config: ctx.accounts.program_config_pda.to_account_info(),
        treasury: ctx.accounts.treasury.to_account_info(),
        create_key: ctx.accounts.create_key.to_account_info(),
        creator: ctx.accounts.owner.to_account_info(),
        multisig: ctx.accounts.multisig.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    msg!(&ctx
        .accounts
        .squads_program
        .to_account_info()
        .key()
        .to_string());

    msg!(&ctx.accounts.treasury.to_account_info().key().to_string());

    let (vault_pubkey, _vault_bump_seed) = Pubkey::find_program_address(
        &[
            SEED_PREFIX,
            &ctx.accounts.multisig.key().to_bytes(),
            SEED_VAULT,
            &[0],
        ],
        &squads_multisig_program::ID,
    );

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

    squads_multisig_program::cpi::multisig_create_v2(
        cpi_ctx_squads,
        squads_multisig_program::MultisigCreateArgsV2 {
            config_authority,
            members,
            memo,
            threshold,
            time_lock,
            rent_collector: None,
        },
    )?;

    project_account.owner = user_account.authority.key();
    project_account.status = ProjectVerification::UnderReview;
    project_account.create_key = ctx.accounts.create_key.key();
    project_account.counter = counter;
    project_account.multisig = ctx.accounts.multisig.key();
    project_account.vault_pubkey = vault_pubkey.key();
    project_account.bump = ctx.bumps.project_account;

    emit!(NewProject {
        authority: user_account.authority.key(),
        counter,
    });

    Ok(())
}

pub fn project_status_handler(
    ctx: Context<UpdateProjectStatusContext>,
    status: ProjectVerification,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;

    project_account.status = status;

    emit!(UpdateProjectStatus {
        authority: ctx.accounts.authority.key(),
        status
    });
    Ok(())
}

pub fn transfer_project_handler(ctx: Context<TransferProjectContext>) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    let transfer_account = &mut ctx.accounts.transfer_user_account;
    project_account.owner = transfer_account.authority;
    Ok(())
}
pub fn close_project_handler(_ctx: Context<CloseProjectContext>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(
    counter: u64,
)]
pub struct CreateProjectContext<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    pub create_key: Signer<'info>,

    #[account(init,
        payer = owner,
        space = 8 + Project::INIT_SPACE,
        seeds = [b"project".as_ref(),create_key.key().as_ref(),&counter.to_le_bytes()],
        bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds = [b"user".as_ref(),owner.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    /// CHECK: This is a program config account
    #[account(mut)]
    pub program_config_pda: UncheckedAccount<'info>,

    /// CHECK: This is a program config treasury account
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,

    /// CHECK: This is a CPI account
    #[account(mut)]
    pub multisig: UncheckedAccount<'info>,

    #[account(address = squads_multisig_program::ID)]
    pub squads_program: Program<'info, squads_multisig_program::program::SquadsMultisigProgram>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateProjectStatusContext<'info> {
    #[account(mut,
        constraint = authority.key() == sub_admin_account.authority.key() @ Errors::InvalidSigner,
        constraint = sub_admin_account.level > 1 @ Errors::InvalidAdmin
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref(),sub_admin_account.authority.key().as_ref(),sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),project_account.counter.to_le_bytes().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TransferProjectContext<'info> {
    #[account(mut,constraint = authority.key() == project_account.owner.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),project_account.counter.to_le_bytes().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds = [b"user".as_ref(),transfer_user_account.authority.key().as_ref()],
        bump  = transfer_user_account.bump
    )]
    pub transfer_user_account: Account<'info, User>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CloseProjectContext<'info> {
    #[account(mut,constraint = authority.key() == project_account.owner.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),project_account.counter.to_le_bytes().as_ref()],
        bump = project_account.bump,
        close = authority,
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
