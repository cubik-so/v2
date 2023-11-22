use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self,Token, TokenAccount, Mint};

use crate::state::Sponsor;




pub fn init_sponsor(ctx: Context<InitSponsorContext>) -> Result<()> {


    let sponsor_account = &mut ctx.accounts.sponsor_account;
    sponsor_account.authority = ctx.accounts.authority.key();
    // sponsor_account.vault = 
    sponsor_account.bump = *ctx.bumps.get("sponsor_account").unwrap();
 
    Ok(())
}


#[derive(Accounts)]
#[instruction(vault:Pubkey)]
pub struct InitSponsorContext<'info> {
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
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}



