use crate::errors::Errors;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(Accounts)]
pub struct EventParticipantInvite<'info> {
    #[account(mut)]
    pub team: Signer<'info>,

    #[account(mut,
            seeds=[ADMIN_PREFIX],
            bump = admin_account.bump
        )]
    pub admin_account: Box<Account<'info, Admin>>,

    #[account(init,
        payer = team,
        space = 8 + EventParticipant::INIT_SPACE,
        seeds = [EVENT_PARTICIPANT_PREFIX,event_account.key().as_ref(),project_account.key().as_ref()],
        bump
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

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl EventParticipantInvite<'_> {
    pub fn validate(&self) -> Result<()> {
        let signer = *self.team.key;

        if let Some(signer) = find_key(self.admin_account.team.clone(), signer) {
        } else {
            return err!(Errors::InvalidSigner);
        }

        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn event_participant_invite(ctx: Context<Self>) -> Result<()> {
        let event_participant_account = &mut ctx.accounts.event_participant_account;

        event_participant_account.authority = ctx.accounts.project_account.creator.key();
        event_participant_account.status = EventProjectStatus::PendingApproval;
        event_participant_account.bump = ctx.bumps.event_participant_account;

        Ok(())
    }
}