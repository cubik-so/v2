use crate::event::UpdateEvent;
use crate::state::Event;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(Accounts)]
#[instruction(event_key:Pubkey)]
pub struct UpdateEventContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
pub fn handler(
    ctx: Context<UpdateEventContext>,
    event_key: Pubkey,
    matching_pool: u64,
    metadata: String,
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;
    event_account.authority = ctx.accounts.authority.key();
    event_account.matching_pool = matching_pool;

    emit!(UpdateEvent {
        authority: ctx.accounts.authority.key(),
        metadata,
    });

    Ok(())
}
