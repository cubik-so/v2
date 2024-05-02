use crate::constant::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program};

/// todo - Add Docs
#[derive(Accounts)]
pub struct ProjectClose<'info> {
    #[account(mut)]
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
    fn validate(&self) -> Result<()> {
        require_eq!(
            self.creator.key(),
            self.project_account.creator.key(),
            Errors::InvalidProjectCreator
        );
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn project_close(ctx: Context<Self>) -> Result<()> {
        Ok(())
    }
}
