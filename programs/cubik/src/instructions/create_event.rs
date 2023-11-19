use crate::event::NewEvent;
use crate::state::{Event};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(Accounts)]
#[instruction(event_key:Pubkey)]
pub struct CreateEventContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Event::INIT_SPACE,
        seeds = [b"event".as_ref(),event_key.as_ref()],
        bump 
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
pub fn handler(ctx: Context<CreateEventContext>, event_key: Pubkey,matching_pool:u64,metadata:String) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;
    event_account.authority = ctx.accounts.authority.key();
    event_account.matching_pool = matching_pool;
    event_account.bump = *ctx.bumps.get("event_account").unwrap();
    emit!(NewEvent{
        authority: ctx.accounts.authority.key(),
        metadata,
        event_key
    });
    
    Ok(())
}