use crate::errors::*;
use crate::event::ProjectTransferEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectTransferArgs {
    new_creator: Pubkey,
}

/// todo - Add Docs
#[derive(Accounts)]
pub struct ProjectTransfer<'info> {
    #[account(mut,constraint = creator.key() == project_account.creator.key() @Errors::InvalidProjectCreator)]
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
    pub fn project_transfer(ctx: Context<Self>, args: ProjectTransferArgs) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;

        project_account.creator = args.new_creator;

        emit!(ProjectTransferEvent {
            create_key: project_account.create_key.key(),
            creator: project_account.creator.key(),
            new_creator: args.new_creator.key(),
            project_account: project_account.key(),
        });
        Ok(())
    }
}
