use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self,Token};

use crate::state::Sponsor;



#[derive(Accounts)]
#[instruction(vault:Pubkey)]
pub struct EventSponsorSolContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),vault.key().as_ref()],
        bump 
    )]
    pub sponsor_account: Account<'info, Sponsor>,


      /// CHECK: Used in trasfer ix
    #[account(mut, constraint= receiver_account.key() == vault.key())]
    pub receiver_account: AccountInfo<'info>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<EventSponsorSolContext>,vault:Pubkey,token:Pubkey,total_amount:u64,total_amount_paid:u64,amount:u64) -> Result<()> {
     let authority = &mut ctx.accounts.authority;
 let receiver_account = &mut ctx.accounts.receiver_account;
     let ix = transfer(
            &authority.key(),
            &vault.key(),
            amount,
        );
      invoke(
            &ix,
            &[
                authority.to_account_info(),
                receiver_account.to_account_info(),
            ],
        );

    let sponsor_account = &mut ctx.accounts.sponsor_account;
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.token = token;
    sponsor_account.total_amount = total_amount;
    sponsor_account.total_amount_paid = total_amount_paid;
    sponsor_account.vault = vault;
    sponsor_account.bump = ctx.bumps.sponsor_account;
 
    Ok(())
}