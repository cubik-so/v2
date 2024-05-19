use crate::errors::Errors;
use crate::event::EventParticipantUpdateEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct EventParticipantUpdateArgs {
    status: EventProjectStatus,
}

#[derive(Accounts)]
pub struct EventParticipantUpdate<'info> {
    #[account(mut, constraint = team.key() == event_team_account.authority.key() @Errors::InvalidSigner)]
    pub team: Signer<'info>,

    #[account(mut,
        seeds = [EVENT_PARTICIPANT_PREFIX,event_account.key().as_ref(),project_account.key().as_ref()],
        bump  = event_participant_account.bump
    )]
    pub event_participant_account: Box<Account<'info, EventParticipant>>,

    #[account(mut,
            seeds=[PROJECT_PREFIX,project_account.create_key.key().as_ref()],
            bump = project_account.bump
        )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
            seeds = [EVENT_PREFIX,event_account.create_key.as_ref()],
            bump = event_account.bump
        )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [EVENT_PREFIX,event_account.key().as_ref(),TEAM_PREFIX,team.key().as_ref()],
        bump = event_team_account.bump
    )]
    pub event_team_account: Box<Account<'info, EventTeam>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl EventParticipantUpdate<'_> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn event_participant_update(
        ctx: Context<Self>,
        args: EventParticipantUpdateArgs,
    ) -> Result<()> {
        let event_participant_account = &mut ctx.accounts.event_participant_account;

        event_participant_account.status = args.status.clone();

        emit!(EventParticipantUpdateEvent {
            event_participant_account: event_participant_account.key(),
            event_team_key: ctx.accounts.team.key(),
            status: args.status,
        });
        Ok(())
    }
}
