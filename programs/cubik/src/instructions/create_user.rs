use crate::state::{User};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use crate::errors::Errors;
use crate::event::NewUser;

#[derive(Accounts)]
pub struct CreateUserContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 +User::INIT_SPACE,
        seeds = [b"user".as_ref(),authority.key().as_ref()],
        bump 
    )]
    pub user_account: Account<'info, User>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<CreateUserContext>, username: String,metadata:String) -> Result<()> {
    
    let user_account = &mut ctx.accounts.user_account;

    require!(username.len() < 32, Errors::MaxLengthExceeded);
    user_account.authority = ctx.accounts.authority.key();
    user_account.bump = *ctx.bumps.get("user_account").unwrap();
    
    emit!(NewUser {
        authority: ctx.accounts.authority.key(),
        metadata:metadata
    });
    Ok(())
}