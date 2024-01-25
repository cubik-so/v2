use crate::errors::Errors;
use crate::event::{NewEvent, UpdateEvent};
use crate::state::{
     Event, SubAdmin, User,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_event_handler(
    ctx: Context<CreateEventContext>,
    matching_pool: u64,
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;

    let event_key = ctx.accounts.event_key.key();

    event_account.authority = ctx.accounts.authority.key();
    event_account.matching_pool = matching_pool;
    event_account.event_key = event_key;
   
    
    event_account.bump = ctx.bumps.event_account;
    emit!(NewEvent {
        authority: ctx.accounts.authority.key(),
        event_key
        
    });

    Ok(())
}


pub fn update_event_handler(
    ctx: Context<UpdateEventContext>,
    matching_pool: u64,
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;
    event_account.matching_pool = matching_pool;

    emit!(UpdateEvent {
        authority: ctx.accounts.authority.key(),
    });

    Ok(())
}




#[derive(Accounts)]
pub struct CreateEventContext<'info> {
    #[account(mut, 
        constraint = user_account.authority.key() == authority.key() @Errors::InvalidSigner,
        constraint = sub_admin_account.authority.key() == authority.key() @Errors::InvalidAdmin,
        constraint = sub_admin_account.level > 0 @Errors::InvalidAdmin
    )]
    pub authority: Signer<'info>,


    #[account(mut)]
    pub event_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Event::INIT_SPACE,
        seeds = [b"event".as_ref(),event_key.key().as_ref()],
        bump 
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [b"admin".as_ref(),sub_admin_account.authority.key().as_ref(),sub_admin_account.create_key.key().as_ref()],
        bump  = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(mut,
        seeds = [b"user",authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info ,User>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct UpdateEventContext<'info> {
    #[account(mut,constraint = event_account.authority.key() == authority.key())]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_account.event_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}



