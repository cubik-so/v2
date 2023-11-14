use crate::event::NewEventJoin;
use crate::state::{EventJoin, RoundProjectStatus, Project, Event};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(Accounts)]
#[instruction(counter:u64,event_key:Pubkey)]
pub struct EventJoinContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventJoin::INIT_SPACE,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump 
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,seeds=[b"project",authority.key().as_ref(),counter.to_le_bytes().as_ref()],bump = project_account.bump)]
    pub project_account: Box<Account<'info,Project>>,


    #[account(mut,seeds=[b"event",event_key.key().as_ref()],bump=event_account.bump)]
    pub event_account: Box<Account<'info,Event>>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
pub fn handler(ctx: Context<EventJoinContext>,counter:u64,event_key:Pubkey,metadata:String) -> Result<()> {

    let event_join_account = &mut ctx.accounts.event_join_account;

    event_join_account.authority = ctx.accounts.authority.key();
    event_join_account.donation = 0;
    event_join_account.status = RoundProjectStatus::PendingApproval;
    event_join_account.bump = ctx.bumps.event_join_account;

    emit!(NewEventJoin {
        authority: ctx.accounts.authority.key(),
        metadata,
    });

    Ok(())
}