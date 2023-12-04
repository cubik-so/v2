use crate::errors::Errors;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_admin_handler(ctx: Context<CreateAdminContext>) -> Result<()> {
    let admin_account = &mut ctx.accounts.admin_account;
    admin_account.authority = ctx.accounts.authority.key();
   
    admin_account.bump = *ctx.bumps.get("admin_account").unwrap();
    Ok(())
}

pub fn create_sub_admin_with_full_permissions_handler(
    ctx: Context<CreateSubAdminWithFullPermissionsContext>,
    create_key: Pubkey,
    event_key:Pubkey,
) -> Result<()> {
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;
    sub_admin_account.authority = create_key.key();
    sub_admin_account.permission = AdminPermission {
        full: true,
        project_join_status:true,
        project_status:true
    };
    sub_admin_account.event = event_key.key();
    sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
    Ok(())
}

pub fn set_sub_admin_project_status_permissions_handler(
    ctx: Context<SetSubAdminEventPermissionsContext>,
    create_key: Pubkey,
    event_key:Pubkey,
) -> Result<()> {
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;

    require!(sub_admin_account.permission.full != true, Errors::InvalidAdmin);

    let new_sub_admin_account = &mut ctx.accounts.sub_admin_account;
    new_sub_admin_account.authority = create_key.key();
    new_sub_admin_account.permission = AdminPermission {
        full: false,
        project_join_status:false,
        project_status:true
    };
    new_sub_admin_account.event = event_key.key();
    new_sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
    Ok(())
}

pub fn set_sub_admin_event_permissions_handler(
    ctx: Context<CreateSubAdminEventStatusContext>,
    create_key: Pubkey,
    event_key:Pubkey,
    permission:AdminPermission
) -> Result<()> {
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;

    require!(sub_admin_account.permission.full != true, Errors::InvalidAdmin);

    let new_sub_admin_account = &mut ctx.accounts.sub_admin_account;
    new_sub_admin_account.authority = create_key.key();
    new_sub_admin_account.permission = permission;
    new_sub_admin_account.event = event_key.key();
    new_sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();

    Ok(())
}

pub fn close_sub_admin_event_access_handler (
    ctx: Context<CloseSubAdminEventAccessContext>,
    create_key: Pubkey,
) -> Result<()> {
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;

    require!(sub_admin_account.permission.full != true, Errors::InvalidAdmin);

    msg!("Account Closed");

    Ok(())
}
pub fn close_sub_admin_handler(
    ctx: Context<CloseSubAdminContext>,
    create_key: Pubkey,
) -> Result<()> {
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;

    require!(sub_admin_account.permission.full != true, Errors::InvalidAdmin);

    msg!("Account Closed");

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
#[instruction(create_key: Pubkey,event_key:Pubkey)]
pub struct CreateSubAdminWithFullPermissionsContext<'info> {
    #[account(mut,
    constraint = authority.key() == admin_account.authority.key() @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + SubAdmin::INIT_SPACE,
        seeds = [b"admin".as_ref(),create_key.key().as_ref()],
        bump 
    )]
    pub sub_admin_account: Account<'info, SubAdmin>,


    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump 
    )]
    pub admin_account: Account<'info, SubAdmin>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(create_key: Pubkey,event_key:Pubkey)]
pub struct SetSubAdminEventPermissionsContext<'info> {
    #[account(mut,
    constraint = authority.key() == sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = sub_admin_account.permission.full == true @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + SubAdmin::INIT_SPACE,
        seeds = [b"admin".as_ref(),create_key.key().as_ref()],
        bump 
    )]
    pub new_sub_admin_account: Account<'info, SubAdmin>,
    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
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
#[instruction(create_key: Pubkey,event_key:Pubkey)]
pub struct CreateSubAdminEventStatusContext<'info> {
    #[account(mut,
    constraint = authority.key() == sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = sub_admin_account.permission.full == true @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + SubAdmin::INIT_SPACE,
        seeds = [b"admin".as_ref(),create_key.key().as_ref(),event_key.key().as_ref()],
        bump 
    )]
    pub new_sub_admin_account: Account<'info, SubAdmin>,
    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
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
#[instruction(create_key: Pubkey,event_key:Pubkey)]
pub struct CloseSubAdminEventAccessContext<'info> {
    #[account(mut,
    constraint = authority.key() == sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = sub_admin_account.permission.full == true @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        close = authority,
        seeds = [b"admin".as_ref(),create_key.key().as_ref(),event_key.key().as_ref()],
        bump = close_sub_admin_account.bump
    )]
    pub close_sub_admin_account: Account<'info, SubAdmin>,

    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
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
#[instruction(create_key: Pubkey)]
pub struct CloseSubAdminContext<'info> {
    #[account(mut,
    constraint = authority.key() == sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = sub_admin_account.permission.full == true @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        close = authority,
        seeds = [b"admin".as_ref(),create_key.key().as_ref()],
        bump = close_sub_admin_account.bump
    )]
    pub close_sub_admin_account: Account<'info, SubAdmin>,

    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Account<'info, SubAdmin>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
