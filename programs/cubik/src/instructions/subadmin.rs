use crate::errors::Errors;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_sub_admin_handler(ctx:Context<CreateSubAdminContext>,new_sub_admin_authority:Pubkey,level:u8,) -> Result<()> {

    let sub_admin_account = &mut ctx.accounts.sub_admin_account;
    sub_admin_account.authority = new_sub_admin_authority;
    sub_admin_account.level = level;
    sub_admin_account.event_access = [Pubkey::default(); 10];
    sub_admin_account.create_key = ctx.accounts.create_key.key();
    sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
    Ok(())
}

pub fn close_sub_admin_handler(
    ctx: Context<CloseSubAdminContext>,
) -> Result<()> {

    msg!("Account Closed");

    Ok(())
}


pub fn add_event_access_handler(
    ctx: Context<AddEventAccessContext>,
    event_key: Pubkey,
) -> Result<()> {

    let sub_admin_account = &mut ctx.accounts.sub_admin_account;
    let mut event_access = sub_admin_account.event_access;    
      
 

    match find_event_key_index(&event_access, &event_key) {
        Some(idx) => {
            event_access[idx] = event_key;
            sub_admin_account.event_access = event_access;
            Ok(())
        },
        None => {
            err!(Errors::InvalidEventKey)
        }
    }
}

pub fn remove_event_access_handler(
    ctx: Context<RemoveEventAccessContext>,
    event_key: Pubkey,
) -> Result<()> {

    let sub_admin_account = &mut ctx.accounts.sub_admin_account;
    let mut event_access = sub_admin_account.event_access;


    match find_event_key_index(&event_access, &event_key) {
        Some(idx) => {
            event_access[idx] = Pubkey::default();
            sub_admin_account.event_access = event_access;
            Ok(())
        },
        None => {
            err!(Errors::InvalidEventKey)
        }
    }
}


#[derive(Accounts)]
#[instruction(new_sub_admin_authority:Pubkey)]
pub struct CreateSubAdminContext<'info> {
    #[account(mut,
    constraint = authority.key() == admin_account.authority.key() @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    pub create_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + SubAdmin::INIT_SPACE,
        seeds = [b"admin".as_ref(),new_sub_admin_authority.key().as_ref(),create_key.key().as_ref()],
        bump 
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,


    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump 
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct AddEventAccessContext<'info> {

    #[account(mut,
    constraint = authority.key() == signer_sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = signer_sub_admin_account.level == 3 @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), sub_admin_account.create_key.key().as_ref()],
        bump  = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,


    #[account(mut,
        seeds = [b"admin".as_ref(),signer_sub_admin_account.authority.key().as_ref(), signer_sub_admin_account.create_key.key().as_ref()],
        bump = signer_sub_admin_account.bump 
    )]
    pub signer_sub_admin_account: Box<Account<'info, SubAdmin>>,
    
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
pub struct RemoveEventAccessContext<'info> {
  
    #[account(mut,
    constraint = authority.key() == signer_sub_admin_account.authority.key() @Errors::InvalidAdmin,
    constraint = signer_sub_admin_account.level == 3 @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,
    
    #[account(mut,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), sub_admin_account.create_key.key().as_ref()],
        bump  = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,


    #[account(mut,
        seeds = [b"admin".as_ref(),signer_sub_admin_account.authority.key().as_ref(), signer_sub_admin_account.create_key.key().as_ref()],
        bump = signer_sub_admin_account.bump 
    )]
    pub signer_sub_admin_account: Box<Account<'info, SubAdmin>>,

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
    constraint = sub_admin_account.level == 3 @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        close = authority,
        seeds = [b"admin".as_ref(),close_sub_admin_account.authority.key().as_ref(),close_sub_admin_account.create_key.key().as_ref()],
        bump = close_sub_admin_account.bump
    )]
    pub close_sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(mut,
        seeds = [b"admin".as_ref(),authority.key().as_ref(),sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


