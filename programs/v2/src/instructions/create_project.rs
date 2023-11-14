use crate::event::NewProject;
use crate::state::{user, Admin, Project, ProjectVerification, User};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
// use solana_program::system_instruction::};

#[derive(Accounts)]
#[instruction(counter:u64)]
pub struct CreateProjectContext<'info> {
    #[account(mut)]
    pub owners: Signer<'info>,

    #[account(init,
        payer = owners,
        space = 8 + Project::INIT_SPACE,
        seeds = [b"project".as_ref(),owners.key().as_ref(),counter.to_le_bytes().as_ref()],
        bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    #[account(mut,
    seeds = [b"user".as_ref(),owners.key().as_ref()],
    bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateProjectContext>,
    counter: u64,
    multi_sig: Pubkey,
    metadata: String,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    let user_account = &mut ctx.accounts.user_account;

    project_account.owner = user_account.authority.key();
    project_account.status = ProjectVerification::UnderReview;
    project_account.counter = counter;
    project_account.multisig = multi_sig;
    project_account.bump = ctx.bumps.project_account;

    emit!(NewProject {
        authority: user_account.authority.key(),
        metadata,
        counter,
    });

    Ok(())
}
