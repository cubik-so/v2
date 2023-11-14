use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

use crate::state::Sponsor;



#[derive(Accounts)]
#[instruction(vault:Pubkey)]
pub struct EventSponsorContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),vault.key().as_ref()],
        bump 
    )]
    pub sponsor_account: Account<'info, Sponsor>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<EventSponsorContext>,vault:Pubkey,token:Pubkey,total_amount:u64,total_amount_paid:u64) -> Result<()> {
    
    let sponsor_account = &mut ctx.accounts.sponsor_account;
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.token = token;
    sponsor_account.total_amount = total_amount;
    sponsor_account.total_amount_paid = total_amount_paid;
    sponsor_account.vault = vault;
    sponsor_account.bump = ctx.bumps.sponsor_account;
 
    Ok(())
}