use crate::constant::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct EventCreateArgs {
    metadata: String,
    start_slot: u64,
    ending_slot: u64,
}

#[derive(Accounts)]
pub struct EventCreate<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventTeam::INIT_SPACE,
        seeds = [EVENT_PREFIX,event_account.key().as_ref(),TEAM_PREFIX,authority.key().as_ref()],
        bump
    )]
    pub event_team_account: Box<Account<'info, EventTeam>>,

    #[account(init,
        payer = authority,
        space = 8 + Event::INIT_SPACE,
        seeds = [EVENT_PREFIX,create_key.key().as_ref()],
        bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl EventCreate<'_> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn event_create(ctx: Context<Self>, args: EventCreateArgs) -> Result<()> {
        let event_account = &mut ctx.accounts.event_account;
        let event_team_account = &mut ctx.accounts.event_team_account;

        //  Event Account
        event_account.authority = *ctx.accounts.authority.key;
        event_account.metadata = args.metadata;
        event_account.event_type = EventType::QFROUND;
        event_account.create_key = *ctx.accounts.create_key.key;
        event_account.ending_slot = args.ending_slot;
        event_account.bump = ctx.bumps.event_account;

        //  Event Team Account
        event_team_account.authority = *ctx.accounts.authority.key;
        event_team_account.bump = ctx.bumps.event_team_account;

        Ok(())
    }
}
