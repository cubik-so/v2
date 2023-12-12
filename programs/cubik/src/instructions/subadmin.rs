use crate::errors::Errors;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_sub_admin_handler(ctx:Context<CreateSubAdminContext>,status:SubAdminPermission,new_sub_admin_authority:Pubkey) -> Result<()> {

    let sub_admin_account = &mut ctx.accounts.sub_admin_account;
    sub_admin_account.authority = ctx.accounts.create_key.key();
    sub_admin_account.permission = status;
    sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
    Ok(())
}

pub fn close_sub_admin_handler(
    ctx: Context<CloseSubAdminContext>,
) -> Result<()> {

    msg!("Account Closed");

    Ok(())
}

#[derive(Accounts)]
#[instruction(status:SubAdminPermission,new_sub_admin_authority:Pubkey)]
pub struct CreateSubAdminContext<'info> {
    #[account(mut,
    constraint = authority.key() == sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = sub_admin_account.permission == SubAdminPermission::GOD @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    pub create_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + SubAdmin::INIT_SPACE,
        seeds = [b"admin".as_ref(),new_sub_admin_authority.key().as_ref(),create_key.key().as_ref()],
        bump 
    )]
    pub new_sub_admin_account: Account<'info, SubAdmin>,


    #[account(mut,
        seeds = [b"admin".as_ref(),sub_admin_account.authority.key().as_ref(),sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump 
    )]
    pub sub_admin_account: Account<'info, SubAdmin>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CloseSubAdminContext<'info> {
    #[account(mut,
    constraint = authority.key() == sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = sub_admin_account.permission == SubAdminPermission::GOD @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        close = authority,
        seeds = [b"admin".as_ref(),close_sub_admin_account.authority.key().as_ref(),close_sub_admin_account.create_key.key().as_ref()],
        bump = close_sub_admin_account.bump
    )]
    pub close_sub_admin_account: Account<'info, SubAdmin>,

    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref(),sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Account<'info, SubAdmin>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}