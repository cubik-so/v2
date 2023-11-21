use crate::errors::Errors;
use crate::event::UpdateProjectStatus;
use crate::state::{Admin, Project, ProjectVerification, User};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(Accounts)]
#[instruction(counter:u64,_owner:Pubkey)]
pub struct UpdateProjectContext<'info> {
    #[account(mut,constraint = authority.key() == sub_admin_account.authority.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, Admin>>,

    #[account(mut,
        seeds = [b"project".as_ref(),_owner.as_ref(),counter.to_le_bytes().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
    seeds = [b"user".as_ref(),_owner.as_ref()],
    bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn verified_handler(
    ctx: Context<UpdateProjectContext>,
    counter: u64,
    _owner: Pubkey,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;

    require!(
        ctx.accounts.sub_admin_account.permission.project_status == true,
        Errors::InvalidAdmin
    );

    project_account.status = ProjectVerification::Verified;

    emit!(UpdateProjectStatus {
        authority: ctx.accounts.authority.key(),
        status: ProjectVerification::Verified
    });
    Ok(())
}
pub fn verification_failed_handler(
    ctx: Context<UpdateProjectContext>,
    counter: u64,
    _owner: Pubkey,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    require!(
        ctx.accounts.sub_admin_account.permission.project_status == true,
        Errors::InvalidAdmin
    );
    project_account.status = ProjectVerification::VerificationFailed;

    emit!(UpdateProjectStatus {
        authority: ctx.accounts.authority.key(),
        status: ProjectVerification::VerificationFailed
    });
    Ok(())
}
