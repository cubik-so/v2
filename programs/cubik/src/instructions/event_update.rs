use crate::constant::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct EventUpdateArgs {
    metadata: Option<String>,
    ending_slot: Option<u64>,
    start_slot: Option<u64>,
}

#[derive(Accounts)]
pub struct EventUpdate<'info> {
    #[account(mut)]
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
    fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    fn event_update(ctx: Context<Self>, args: EventUpdateArgs) -> Result<()> {
        let event_account = &mut ctx.accounts.event_account;

        if args.ending_slot.is_some() {
            event_account.ending_slot = args.ending_slot.unwrap()
        };

        if args.metadata.is_some() {
            event_account.metadata = args.metadata.unwrap()
        };

        Ok(())
    }
}
