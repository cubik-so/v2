use std::vec;

use crate::errors::Errors;
use crate::event::{NewEventJoin, NewProject, UpdateProjectStatus, UpdateProject};
use crate::state::{
    user, Admin, Event, EventJoin, EventProjectStatus, Project, ProjectVerification, User, SubAdmin,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use squads_multisig_program::{Member, Permission, Permissions};

pub fn create_project_handler(
    ctx: Context<CreateProjectContext>,
    counter: u64,
    multi_sig: Pubkey,
    metadata: [u8;32],
    // members_keys: Vec<Pubkey>,
    // threshold: u16,
    // config_authority: Option<Pubkey>,
    // time_lock: u32,
    // memo: Option<String>,
) -> Result<()> {

    let project_account = &mut ctx.accounts.project_account;
    let user_account = &mut ctx.accounts.user_account;

    // let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreate {
    //     create_key: ctx.accounts.create_key.to_account_info(), // this is example
    //     creator: ctx.accounts.owner.to_account_info(),
    //     multisig: ctx.accounts.multisig.to_account_info(),
    //     system_program: ctx.accounts.system_program.to_account_info(),
    // };

    // let cpi_ctx_squads = CpiContext::new(
    //     ctx.accounts.squads_program.to_account_info(),
    //     create_multisig,
    // );
    // let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

    // // Use from_vec to create a Permissions instance with all permissions
    // let permission = Permissions::from_vec(&all_permissions);

    // let members: Vec<Member> = members_keys
    //     .iter()
    //     .map(|key| Member {
    //         key: *key,
    //         permissions: permission,
    //     })
    //     .collect();

    // squads_multisig_program::cpi::multisig_create(
    //     cpi_ctx_squads,
    //     squads_multisig_program::MultisigCreateArgs {
    //         config_authority,
    //         members,
    //         memo,
    //         threshold,
    //         time_lock,
    //     },
    // )?;

    project_account.owner = user_account.authority.key();
    project_account.status = ProjectVerification::UnderReview;
    project_account.metadata = metadata;
    project_account.create_key = ctx.accounts.create_key.key();
    project_account.counter = counter;
    project_account.multisig = multi_sig;
    project_account.bump = *ctx.bumps.get("project_account").unwrap();

    emit!(NewProject {
        authority: user_account.authority.key(),
        metadata,
        counter,
    });

    Ok(())
}

pub fn verified_status_handler(
    ctx: Context<UpdateProjectStatusContext>,
    _counter: u64,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;

    require!(
        ctx.accounts.sub_admin_account.permission.project_status == true,
        Errors::InvalidAdmin
    );

    require!(
        ctx.accounts.sub_admin_account.event == ctx.accounts.authority.key(),
        Errors::InvalidAdmin
    );

    project_account.status = ProjectVerification::Verified;

    emit!(UpdateProjectStatus {
        authority: ctx.accounts.authority.key(),
        status: ProjectVerification::Verified
    });
    Ok(())
}

pub fn failed_status_handler(
    ctx: Context<UpdateProjectStatusContext>,
    _counter: u64,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    require!(
        ctx.accounts.sub_admin_account.permission.project_status == true,
        Errors::InvalidAdmin
    );
    require!(
        ctx.accounts.sub_admin_account.event == ctx.accounts.authority.key(),
        Errors::InvalidAdmin
    );
    project_account.status = ProjectVerification::VerificationFailed;

    emit!(UpdateProjectStatus {
        authority: ctx.accounts.authority.key(),
        status: ProjectVerification::VerificationFailed
    });
    Ok(())
}

pub fn update_project_handler(
    ctx: Context<UpdateProjectContext>,
    _counter: u64,
    metadata:[u8;32]
) -> Result<()> {

    let project_account = &mut ctx.accounts.project_account;
   
    project_account.metadata = metadata;

    emit!(UpdateProject {
        authority: ctx.accounts.authority.key(),
        metadata:metadata
    });
    Ok(())
}


pub fn transfer_project_handler(ctx: Context<TransferProjectContext>,
    _counter: u64,
)-> Result<()>{

    let project_account = &mut ctx.accounts.project_account;
    let transfer_account = &mut ctx.accounts.transfer_user_account;
    project_account.owner = transfer_account.authority;
    Ok(())
}


#[derive(Accounts)]
#[instruction( 
    counter: u64,
    // multi_sig: Pubkey,
    // metadata: String,
    // members: Vec<Member>,
    // threshold: u16,
    // config_authority: Option<Pubkey>,
    // time_lock: u32,
    // memo: Option<String>
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
#[instruction(_counter: u64)]
pub struct UpdateProjectStatusContext<'info> {

    #[account(mut,constraint = authority.key() == sub_admin_account.authority.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),_counter.to_le_bytes().as_ref()],
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
#[instruction(_counter: u64)]
pub struct  UpdateProjectContext<'info>{
    #[account(mut,constraint = authority.key() == project_account.owner.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),_counter.to_le_bytes().as_ref()],
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
#[instruction(_counter: u64)]
pub struct  TransferProjectContext<'info>{

    #[account(mut,constraint = authority.key() == project_account.owner.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),_counter.to_le_bytes().as_ref()],
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
#[instruction(_counter: u64)]
pub struct  CloseProjectContext<'info>{

    #[account(mut,constraint = authority.key() == project_account.owner.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(),_counter.to_le_bytes().as_ref()],
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