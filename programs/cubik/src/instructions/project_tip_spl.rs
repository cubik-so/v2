use crate::constant::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self, Mint, Token, TokenAccount};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectTipSPLArgs {
    pub amount: u64,     // Amount of token with decimals
    pub amount_usd: u64, // Amount in USD ( 1USD = 10^6 )
}

#[derive(Accounts)]
pub struct ProjectTipSPL<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == project_account.vault_pubkey.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        seeds = [PROJECT_PREFIX,project_account.create_key.key().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
}

impl ProjectTipSPL<'_> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn project_tip_spl(ctx: Context<Self>, args: ProjectTipSPLArgs) -> Result<()> {
        let sender_ata = &ctx.accounts.token_ata_sender;
        let receiver_ata = &ctx.accounts.token_ata_receiver;

        let transfer_instruction = token::Transfer {
            from: sender_ata.to_account_info(),
            to: receiver_ata.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_ctx_trans = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );
        anchor_spl::token::transfer(cpi_ctx_trans, args.amount)?;

        Ok(())
    }
}
