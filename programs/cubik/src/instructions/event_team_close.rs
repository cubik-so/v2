use crate::errors::Errors;
use crate::event::EventTeamCloseEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(Accounts)]
pub struct EventTeamClose<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut,
        close = authority,
        seeds = [EVENT_PREFIX,event_account.key().as_ref(),TEAM_PREFIX,to_close_event_team_account.key().as_ref()],
        bump = to_close_event_team_account.bump
    )]
    pub to_close_event_team_account: Box<Account<'info, EventTeam>>,

    #[account(mut,
        seeds = [EVENT_PREFIX,event_account.create_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl EventTeamClose<'_> {
    pub fn validate(&self) -> Result<()> {
        require_keys_eq!(
            self.event_account.authority.key(),
            self.authority.key(),
            Errors::InvalidSigner
        );

        // Make sure event owner can't delete his team account
        require_keys_neq!(
            self.event_team_account.authority.key(),
            self.event_account.authority.key(),
            Errors::InvalidSigner
        );

        Ok(())
    }
    pub fn event_team_close(ctx: Context<Self>, args: EventTeamCloseArgs) -> Result<()> {
        emit!(EventTeamCloseEvent {
            authority: ctx.accounts.authority.key(),
            event_team_account: ctx.accounts.event_team_account.key(),
        });
        Ok(())
    }
}
