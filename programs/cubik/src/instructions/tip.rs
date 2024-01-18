use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

use crate::event::NewTipSPL;
use crate::state::{Project, User};
use anchor_spl::token::{self, Mint, Token, TokenAccount};

// todo -- Fix these ix

pub fn tip_spl_user(ctx: Context<TipSplUserContext>, amount: u64) -> Result<()> {
    let transfer_instruction = anchor_spl::token::Transfer {
        from: ctx.accounts.token_ata_sender.to_account_info(),
        to: ctx.accounts.token_ata_receiver.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_ctx_trans = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );
    anchor_spl::token::transfer(cpi_ctx_trans, amount)?;
    emit!(NewTipSPL {
        amount: amount,
        authority: ctx.accounts.authority.key(),
        token: ctx.accounts.token_mint.key(),
    });
    Ok(())
}

#[derive(Accounts)]
pub struct TipSplUserContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut,seeds=[b"user".as_ref(),user_account.authority.key().as_ref()],bump= user_account.bump)]
    pub user_account: Box<Account<'info, User>>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == user_account.authority.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
