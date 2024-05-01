use crate::constant::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectTransferArgs {
    new_creator: Pubkey,
}

/// todo - Add Docs
#[derive(Accounts)]
pub struct ProjectTransfer<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut,
    seeds = [PROJECT_PREFIX, project_account.create_key.as_ref()],
    bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}
/// todo - Add Docs
impl ProjectTransfer<'_> {
    fn validate(&self) -> Result<()> {
        require_eq!(
            self.creator.key(),
            self.project_account.creator.key(),
            Errors::InvalidProjectCreator
        );
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn project_transfer(ctx: Context<Self>, args: ProjectTransferArgs) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;

        project_account.creator = args.new_creator;
        Ok(())
    }
}
