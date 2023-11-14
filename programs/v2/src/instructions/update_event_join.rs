use crate::errors::Errors;
use crate::state::{Admin, Event, EventJoin, Project, ProjectVerification, RoundProjectStatus};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(Accounts)]
#[instruction(counter:u64,event_key:Pubkey, _owner: Pubkey,)]
pub struct UpdateEventJoinContext<'info> {
    #[account(mut,constraint = authority.key() == event_account.authority.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    #[account(mut,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump  = event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_key.key().as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [b"project".as_ref(),_owner.key().as_ref(), counter.to_le_bytes().as_ref()],
        bump = project_account.bump)]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
pub fn update_approve_handler(
    ctx: Context<UpdateEventJoinContext>,
    counter: u64,
    event_key: Pubkey,
    _owner: Pubkey,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
    let project_account = &mut ctx.accounts.project_account;

    require!(
        project_account.status != ProjectVerification::VerificationFailed,
        Errors::InvalidProjectVerification
    );

    event_join_account.status = RoundProjectStatus::Approved;

    Ok(())
}
pub fn update_reject_handler(
    ctx: Context<UpdateEventJoinContext>,
    counter: u64,
    event_key: Pubkey,
    _owner: Pubkey,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
    let project_account = &mut ctx.accounts.project_account;

    require!(
        project_account.status != ProjectVerification::VerificationFailed,
        Errors::InvalidProjectVerification
    );

    event_join_account.status = RoundProjectStatus::Rejected;

    Ok(())
}
