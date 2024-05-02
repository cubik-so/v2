use crate::constant::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectUpdateArgs {}

#[derive(Accounts)]
pub struct ProjectUpdate<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut,
        seeds = [PROJECT_PREFIX,project_account.create_key.key().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl ProjectUpdate<'_> {
    fn project_update(ctx: Context<Self>) -> Result<()> {
        Ok(())
    }
}
