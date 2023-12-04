use crate::errors::Errors;
use crate::event::{NewEvent, NewEventJoin, UpdateEvent, self};
use crate::state::{
    Admin, AdminPermission, Event, EventJoin, EventProjectStatus, Project, ProjectVerification, SubAdmin, User,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_event_handler(
    ctx: Context<CreateEventContext>,
    matching_pool: u64,
    metadata: [u8;32],
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;

    let sub_admin_account = &mut ctx.accounts.sub_admin_account;
    let event_key = ctx.accounts.event_key.key();

    event_account.authority = ctx.accounts.authority.key();
    event_account.matching_pool = matching_pool;
    event_account.event_key = event_key;
    sub_admin_account.authority = ctx.accounts.authority.key();
    sub_admin_account.permission = AdminPermission {
        full: false,
        event_join_status: true,
        project_status: false,
    };
    sub_admin_account.event = event_account.key();
    event_account.bump = *ctx.bumps.get("event_account").unwrap();
    sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
    emit!(NewEvent {
        authority: ctx.accounts.authority.key(),
        metadata,
        event_key
        
    });

    Ok(())
}

pub fn create_event_join_handler(
    ctx: Context<EventJoinContext>,
    counter: u64,
    event_key: Pubkey,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
    let event_account = &mut ctx.accounts.event_account;
    let project_account = &mut ctx.accounts.project_account;

    require!(
        project_account.status != ProjectVerification::Verified,
        Errors::InvalidProjectVerification
    );

    event_join_account.authority = ctx.accounts.authority.key();
    event_join_account.donation = 0;
    event_join_account.status = EventProjectStatus::PendingApproval;
    event_join_account.bump = *ctx.bumps.get("event_join_account").unwrap();

    emit!(NewEventJoin {
        authority: ctx.accounts.authority.key(),
        event_account: event_account.key(),
        project_account:project_account.key()
    });

    Ok(())
}

pub fn update_approve_handler(
    ctx: Context<UpdateEventJoinContext>,
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;
    let event_join_account = &mut ctx.accounts.event_join_account;
    let project_account = &mut ctx.accounts.project_account;
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;

    require!(
        project_account.status != ProjectVerification::VerificationFailed,
        Errors::InvalidProjectVerification
    );

    require!(
        sub_admin_account.event != event_account.key(),
        Errors::InvalidAdmin
    );



    event_join_account.status = EventProjectStatus::Approved;

    Ok(())
}

pub fn update_reject_handler(
    ctx: Context<UpdateEventJoinContext>,
) -> Result<()> {
     let event_account = &mut ctx.accounts.event_account;
    let event_join_account = &mut ctx.accounts.event_join_account;
    let project_account = &mut ctx.accounts.project_account;
    let sub_admin_account = &mut ctx.accounts.sub_admin_account;

    require!(
        project_account.status != ProjectVerification::VerificationFailed,
        Errors::InvalidProjectVerification
    );

    require!(
        sub_admin_account.event != event_account.key(),
        Errors::InvalidAdmin
    );

    event_join_account.status = EventProjectStatus::Rejected;

    Ok(())
}

pub fn update_event_handler(
    ctx: Context<UpdateEventContext>,
    matching_pool: u64,
    metadata: [u8;32],
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;
    event_account.matching_pool = matching_pool;
    event_account.metadata = metadata;

    emit!(UpdateEvent {
        authority: ctx.accounts.authority.key(),
        metadata,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct CreateEventContext<'info> {
    #[account(mut, constraint = user_account.authority.key() == authority.key() )]
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

    #[account(init,
        payer = authority,
        space = 8 + SubAdmin::INIT_SPACE,
        seeds = [b"admin".as_ref(),authority.key().as_ref(),event_account.key().as_ref()],
        bump 
    )]
    pub sub_admin_account: Account<'info, SubAdmin>,

    #[account(mut,
        seeds = [b"user",authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Account<'info ,User>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct EventJoinContext<'info> {
    #[account(mut,constraint = authority.key() == project_account.owner.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventJoin::INIT_SPACE,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump 
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
            seeds=[b"project",project_account.create_key.key().as_ref(),project_account.counter.to_le_bytes().as_ref()],
            bump = project_account.bump
        )]
    pub project_account: Box<Account<'info, Project>>,


    #[account(mut,seeds=[b"event",event_account.event_key.key().as_ref()],bump=event_account.bump)]
    pub event_account: Box<Account<'info, Event>>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateEventJoinContext<'info> {
    #[account(mut,constraint = event_account.key() == sub_admin_account.event.key() @ Errors::InvalidAdmin)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), event_account.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(mut,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump  = event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_account.event_key.key().as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(), project_account.counter.to_le_bytes().as_ref()],
        bump = project_account.bump)]
    pub project_account: Box<Account<'info, Project>>,

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
