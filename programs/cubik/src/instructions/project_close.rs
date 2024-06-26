use crate::errors::*;
use crate::event::ProjectCloseEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

/// todo - Add Docs
#[derive(Accounts)]
pub struct ProjectClose<'info> {
    #[account(mut,constraint = creator.key() == project_account.creator.key() @Errors::InvalidProjectCreator)]
    pub creator: Signer<'info>,

    #[account(mut,
    close = creator,
    seeds = [PROJECT_PREFIX, project_account.create_key.as_ref()],
    bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

/// todo - Add Docs
impl ProjectClose<'_> {
    pub fn project_close(ctx: Context<Self>) -> Result<()> {
        emit!(ProjectCloseEvent {
            create_key: ctx.accounts.project_account.create_key.key(),
            creator: ctx.accounts.project_account.creator.key(),
            project_account: ctx.accounts.project_account.key()
        });
        Ok(())
    }
}
