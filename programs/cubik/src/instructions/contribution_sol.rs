use crate::errors::*;
use crate::event::ContributionSOLEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use solana_program::system_instruction;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct ContributionSOLArgs {
    pub amount: u64, // Amount in SOL 1 SOL = 10^9
}

#[derive(Accounts)]
pub struct ContributionSOL<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Receiver is the project account receiver
    #[account(mut, constraint = project_account.receiver.key() == receiver.key())]
    pub receiver: AccountInfo<'info>,

    #[account(mut,
        seeds = [PROJECT_PREFIX,project_account.create_key.key().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds=[EVENT_PREFIX, event_account.create_key.key().as_ref()],
        bump=event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [EVENT_PARTICIPANT_PREFIX,event_account.key().as_ref(),project_account.key().as_ref()],
        bump = event_participant_account.bump
    )]
    pub event_participant_account: Box<Account<'info, EventParticipant>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

// Add Docs
impl ContributionSOL<'_> {
    pub fn validate(&self, args: ContributionSOLArgs) -> Result<()> {
        if args.amount < MIN_SOL {
            return Err(Errors::AmountTooLow.into());
        }

        require!(
            self.event_participant_account.status == EventProjectStatus::Approved,
            Errors::InvalidProjectVerification
        );

        // Not Reqired right now
        //
        // require!(
        //     self.project_account.status == ProjectVerification::Verified,
        //     Errors::InvalidProjectVerification
        // );

        let current_slot = Clock::get()?.slot;

        if current_slot > self.event_account.ending_slot {
            return err!(Errors::EventEnded);
        }

        if current_slot < self.event_account.start_slot {
            return err!(Errors::EventNotStarted);
        }

        Ok(())
    }

    #[access_control(ctx.accounts.validate(args))]
    pub fn contribution_sol(
        ctx: Context<ContributionSOL>,
        args: ContributionSOLArgs,
    ) -> Result<()> {
        let project_account = &ctx.accounts.project_account;

        let receiver = &ctx.accounts.receiver;

        let transfer_instruction = system_instruction::transfer(
            ctx.accounts.authority.key,
            &project_account.receiver,
            args.amount,
        );

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.authority.to_account_info(),
                receiver.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        emit!(ContributionSOLEvent {
            amount: args.amount,
            authority: ctx.accounts.authority.key(),
            event_key: ctx.accounts.event_account.create_key.key(),
            project_create_key: ctx.accounts.project_account.create_key.key(),
        });

        Ok(())
    }
}
