use crate::errors::Errors;
use crate::event::ProjectUpdateEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProjectUpdateArgs {
    receiver: Option<Pubkey>,
    metadata: Option<String>,
}

#[derive(Accounts)]
pub struct ProjectUpdate<'info> {
    #[account(mut, constraint = creator.key() == project_account.creator.key() @Errors::InvalidProjectCreator )]
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
    pub fn project_update(ctx: Context<Self>, args: ProjectUpdateArgs) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;

        if args.metadata.is_some() {
            project_account.metadata = args.metadata.clone().unwrap();
        }

        if args.receiver.is_some() {
            project_account.receiver = args.receiver.unwrap();
        }

        emit!(ProjectUpdateEvent {
            create_key: ctx.accounts.project_account.create_key.key(),
            creator: ctx.accounts.project_account.creator.key(),
            project_account: ctx.accounts.project_account.key(),
            metadata: args.metadata,
            receiver: args.receiver
        });
        Ok(())
    }
}
