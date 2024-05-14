use crate::errors::*;
use crate::event::NewContributionSPL;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use anchor_spl::token::Mint;
use anchor_spl::token::Token;
use anchor_spl::token::{self, TokenAccount};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ContributionSPLArgs {
    pub amount: u64, // Amount of token with decimals
}

#[derive(Accounts)]
pub struct ContributionSPL<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == project_account.reciver.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

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

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

impl ContributionSPL<'_> {
    pub fn validate(&self, args: ContributionSPLArgs) -> Result<()> {
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

        // TODO: - Add check for slots start and end

        Ok(())
    }

    #[access_control(ctx.accounts.validate(args))]
    pub fn contribution_spl(
        ctx: Context<ContributionSPL>,
        args: ContributionSPLArgs,
    ) -> Result<()> {
        let project_account = &ctx.accounts.project_account.clone();

        let transfer_instruction = anchor_spl::token::Transfer {
            from: ctx.accounts.token_ata_sender.to_account_info(),
            to: ctx.accounts.token_ata_receiver.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_ctx_trans = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );

        anchor_spl::token::transfer(cpi_ctx_trans, args.amount)?;

        emit!(NewContributionSPL {
            amount: args.amount,
            authority: ctx.accounts.authority.key(),
            event_key: ctx.accounts.event_account.create_key.key(),
            project_create_key: ctx.accounts.project_account.create_key.key(),
            token: ctx.accounts.token_mint.key(),
        });
        Ok(())
    }
}
