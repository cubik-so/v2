use crate::errors::Errors;
use crate::event::{NewEvent, NewEventJoin, UpdateEvent};
use crate::state::{Event,Admin, AdminPermission, ProjectVerification, EventProjectStatus, EventJoin, Project};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};




pub fn create_event(ctx: Context<CreateEventContext>, event_key: Pubkey,matching_pool:u64,metadata:String) -> Result<()> {
    
    let event_account = &mut ctx.accounts.event_account;

    let sub_admin_account = &mut ctx.accounts.sub_admin_account;


    event_account.authority = ctx.accounts.authority.key();
    event_account.matching_pool = matching_pool;

    sub_admin_account.authority = ctx.accounts.authority.key();
    sub_admin_account.permission = AdminPermission {
        full:false,
        project_join_status:true,
        project_status:false
    };
    
    event_account.bump = *ctx.bumps.get("event_account").unwrap();
    sub_admin_account.bump = *ctx.bumps.get("sub_admin_account").unwrap();
    emit!(NewEvent{
        authority: ctx.accounts.authority.key(),
        metadata,
        event_key
    });
    
    Ok(())
}

pub fn create_event_join(
    ctx: Context<EventJoinContext>,
    counter: u64,
    event_key: Pubkey,
    metadata: String,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
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
        metadata,
    });

    Ok(())
}

pub fn update_approve_handler(
    ctx: Context<UpdateEventJoinContext>,
    counter: u64,
    event_key: Pubkey,
    _owner: Pubkey,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
    let project_account = &mut ctx.accounts.project_account;

    require!(
        project_account.status != ProjectVerification::VerificationFailed,
        Errors::InvalidProjectVerification
    );

    event_join_account.status = EventProjectStatus::Approved;

    Ok(())
}
pub fn update_reject_handler(
    ctx: Context<UpdateEventJoinContext>,
    counter: u64,
    event_key: Pubkey,
    _owner: Pubkey,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
    let project_account = &mut ctx.accounts.project_account;

    require!(
        project_account.status != ProjectVerification::VerificationFailed,
        Errors::InvalidProjectVerification
    );

    event_join_account.status = EventProjectStatus::Rejected;

    Ok(())
}



pub fn update_event(
    ctx: Context<UpdateEventContext>,
    event_key: Pubkey,
    matching_pool: u64,
    metadata: String,
) -> Result<()> {
    let event_account = &mut ctx.accounts.event_account;
    event_account.authority = ctx.accounts.authority.key();
    event_account.matching_pool = matching_pool;

    emit!(UpdateEvent {
        authority: ctx.accounts.authority.key(),
        metadata,
    });

    Ok(())
}


#[derive(Accounts)]
#[instruction(event_key:Pubkey)]
pub struct CreateEventContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Event::INIT_SPACE,
        seeds = [b"event".as_ref(),event_key.as_ref()],
        bump 
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(init,
        payer = authority,
        space = 8 + Admin::INIT_SPACE,
        seeds = [b"admin".as_ref(),authority.key().as_ref()],
        bump 
    )]
    pub sub_admin_account: Account<'info, Admin>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(counter:u64,event_key:Pubkey)]
pub struct EventJoinContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventJoin::INIT_SPACE,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump 
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
            seeds=[b"project",authority.key().as_ref(),counter.to_le_bytes().as_ref()],
            bump = project_account.bump
        )]
    pub project_account: Box<Account<'info,Project>>,


    #[account(mut,seeds=[b"event",event_key.key().as_ref()],bump=event_account.bump)]
    pub event_account: Box<Account<'info,Event>>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(counter:u64,event_key:Pubkey, _owner: Pubkey,)]
pub struct UpdateEventJoinContext<'info> {
    #[account(mut,constraint = authority.key() == event_account.authority.key() @ Errors::InvalidSigner)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    #[account(mut,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump  = event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_key.key().as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [b"project".as_ref(),_owner.key().as_ref(), counter.to_le_bytes().as_ref()],
        bump = project_account.bump)]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(event_key:Pubkey)]
pub struct UpdateEventContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"event".as_ref(),event_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}