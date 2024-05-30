use crate::errors::Errors;
use crate::event::EventTeamCreateEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct EventTeamCreateArgs {
    new_team_member: Pubkey,
}

#[derive(Accounts)]
#[instruction(args:EventTeamCreateArgs)]
pub struct EventTeamCreate<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventTeam::INIT_SPACE,
        seeds = [EVENT_PREFIX,event_account.key().as_ref(),TEAM_PREFIX,args.new_team_member.key().as_ref()],
        bump
    )]
    pub new_event_team_account: Box<Account<'info, EventTeam>>,

    #[account(mut,
        seeds = [EVENT_PREFIX,event_account.key().as_ref(),TEAM_PREFIX, authority.key().as_ref()],
        bump = event_team_account.bump
    )]
    pub event_team_account: Box<Account<'info, EventTeam>>,

    #[account(mut,
        seeds = [EVENT_PREFIX,event_account.create_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}
impl EventTeamCreate<'_> {
    fn validate(&self) -> Result<()> {
        require_keys_eq!(
            self.authority.key(),
            self.event_team_account.authority.key(),
            Errors::InvalidSigner
        );

        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn event_team_create(ctx: Context<Self>, args: EventTeamCreateArgs) -> Result<()> {
        let new_team_account = &mut ctx.accounts.new_event_team_account;

        new_team_account.authority = args.new_team_member;
        new_team_account.bump = ctx.bumps.new_event_team_account;

        emit!(EventTeamCreateEvent {
            authority: ctx.accounts.authority.key(),
            new_event_team_account: ctx.accounts.new_event_team_account.key(),
        });
        Ok(())
    }
}
