use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_admin_handler(ctx: Context<CreateAdminContext>) -> Result<()> {
    let admin_account = &mut ctx.accounts.admin_account;
    admin_account.authority = ctx.accounts.authority.key();
   
    admin_account.bump = ctx.bumps.admin_account;
    Ok(())
}


#[derive(Accounts)]
pub struct CreateAdminContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Admin::INIT_SPACE,
        seeds = [b"admin".as_ref()],
        bump 
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}