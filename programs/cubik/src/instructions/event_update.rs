use crate::errors::Errors;
use crate::event::EventTeamUpdateEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct EventUpdateArgs {
    metadata: Option<String>,
    ending_slot: Option<u64>,
    start_slot: Option<u64>,
}

#[derive(Accounts)]
pub struct EventUpdate<'info> {
    #[account(mut, constraint = authority.key() == event_team_account.authority.key() @Errors::InvalidEventCreator)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [EVENT_PREFIX, event_account.key().as_ref(),TEAM_PREFIX,authority.key().as_ref()],
        bump = event_team_account.bump
    )]
    pub event_team_account: Box<Account<'info, EventTeam>>,

    #[account(mut,
        seeds = [EVENT_PREFIX,event_account.create_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl EventUpdate<'_> {
    pub fn event_update(ctx: Context<Self>, args: EventUpdateArgs) -> Result<()> {
        let event_account = &mut ctx.accounts.event_account;

        if args.ending_slot.is_some() {
            event_account.ending_slot = args.ending_slot.unwrap()
        };

        if args.metadata.is_some() {
            event_account.metadata = args.metadata.clone().unwrap()
        };

        if args.start_slot.is_some() {
            event_account.start_slot = args.start_slot.unwrap()
        }

        emit!(EventTeamUpdateEvent {
            authority: ctx.accounts.authority.key(),
            event_team_account: ctx.accounts.event_team_account.key(),
            ending_slot: args.ending_slot,
            start_slot: args.start_slot,
            metadata: args.metadata,
        });
        Ok(())
    }
}
