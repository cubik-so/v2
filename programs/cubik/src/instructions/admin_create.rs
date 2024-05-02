use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

#[derive(Accounts)]
pub struct AdminCreate<'info> {
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
}

impl AdminCreate<'_> {
    fn admin_create(ctx: Context<Self>) -> Result<()> {}
}
