use crate::constant::*;
use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ContributionSOLArgs {
    pub amount: u64,     // Amount in SOL 1 SOL = 10^9
    pub amount_usd: u64, // Amount in USD 1 USD = 10^6
}

#[derive(Accounts)]
pub struct ContributionSOL<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Receiver is the project vault
    #[account(mut, constraint = project_account.vault_pubkey.key() == receiver.key())]
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
        if args.amount_usd < MIN_USD {
            return Err(Errors::AmountTooLow.into());
        }

        require!(
            self.event_participant_account.status == EventProjectStatus::Approved,
            Errors::InvalidProjectVerification
        );

        require!(
            self.project_account.status == ProjectVerification::Verified,
            Errors::InvalidProjectVerification
        );
        Ok(())
    }

    #[access_control(ctx.accounts.validate(args))]
    pub fn contribution_sol(
        ctx: Context<ContributionSOL>,
        args: ContributionSOLArgs,
    ) -> Result<()> {
        let project_account = &ctx.accounts.project_account;
        let event_participant_account = &mut ctx.accounts.event_participant_account;

        let receiver = &ctx.accounts.receiver;

        let transfer_instruction = system_instruction::transfer(
            ctx.accounts.authority.key,
            &project_account.vault_pubkey,
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

        Ok(())
    }
}
