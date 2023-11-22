use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use crate::errors::Errors;


pub fn create_admin(ctx: Context<CreateAdminContext>) -> Result<()> {
    let admin_account = &mut ctx.accounts.admin_account;
    admin_account.authority = ctx.accounts.authority.key();
    admin_account.permission = AdminPermission {
        full:true,
        project_join_status:true,
        project_status:true,
    };
    admin_account.bump = *ctx.bumps.get("admin_account").unwrap();
    Ok(())
}

pub fn create_sub_admin(ctx: Context<CreateSubAdminContext>,create_key:Pubkey,permission:AdminPermission) -> Result<()> {
    
    let sub_admin_account = &mut ctx.accounts.admin_account;
    sub_admin_account.authority = create_key.key();
    sub_admin_account.permission = permission;
    sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
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
    pub admin_account: Account<'info, Admin>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateSubAdminContext<'info> {
    #[account(mut,
    constraint = authority.key() == admin_account.authority.key() @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Admin::INIT_SPACE,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
        bump 
    )]
    pub sub_admin_account: Account<'info, Admin>,

    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump 
    )]
    pub admin_account: Account<'info, Admin>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
