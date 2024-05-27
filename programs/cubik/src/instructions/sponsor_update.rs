use crate::event::SponsorUpdateEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SponsorUpdateArgs {
    pub metadata: Option<String>,
}
#[derive(Accounts)]
pub struct SponsorUpdate<'info> {
    #[account(mut, constraint = sponsor_account.authority.key() ==authority.key() )]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [SPONSOR_PREFIX, sponsor_account.event_account.key().as_ref(),sponsor_account.create_key.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl SponsorUpdate<'_> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn sponsor_create(ctx: Context<SponsorUpdate>, args: SponsorUpdateArgs) -> Result<()> {
        let sponsor_account = &mut ctx.accounts.sponsor_account;

        if args.metadata.is_some() {
            sponsor_account.metadata = args.metadata.unwrap()
        }
        emit!(SponsorUpdateEvent {
            authority: ctx.accounts.authority.key(),
            sponsor_account: ctx.accounts.sponsor_account.key(),
        });

        Ok(())
    }
}
