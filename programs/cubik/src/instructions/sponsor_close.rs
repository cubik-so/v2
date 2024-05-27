use crate::event::SponsorCloseEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(Accounts)]
pub struct SponsorClose<'info> {
    #[account(mut, constraint = sponsor_account.authority.key() ==authority.key() )]
    pub authority: Signer<'info>,

    #[account(mut,
            close = authority,
        seeds = [SPONSOR_PREFIX, sponsor_account.event_account.key().as_ref(),sponsor_account.create_key.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl SponsorClose<'_> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn sponsor_close(ctx: Context<SponsorClose>) -> Result<()> {
        emit!(SponsorCloseEvent {
            authority: ctx.accounts.authority.key(),
            sponsor_account: ctx.accounts.sponsor_account.key(),
        });
        Ok(())
    }
}
