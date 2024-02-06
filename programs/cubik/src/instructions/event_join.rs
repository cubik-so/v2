use crate::errors::Errors;
use crate::event::NewEventJoin;
use crate::find_event_key_index;
use crate::state::{
     Event, EventJoin, EventProjectStatus, Project, ProjectVerification, SubAdmin,
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_event_join_handler(
    ctx: Context<CreateEventJoinContext>,
) -> Result<()> {
    let event_join_account = &mut ctx.accounts.event_join_account;
    let event_account = &mut ctx.accounts.event_account;
    let project_account = &mut ctx.accounts.project_account;

    event_join_account.authority = ctx.accounts.authority.key();
    event_join_account.donation = 0;
    event_join_account.status = EventProjectStatus::PendingApproval;
    event_join_account.bump = ctx.bumps.event_join_account;

    emit!(NewEventJoin {
        authority: ctx.accounts.authority.key(),
        event_account: event_account.key(),
        project_account:project_account.key()
    });

    Ok(())
}

pub fn update_event_status_handler(
    ctx: Context<UpdateEventJoinStatusContext>,
    status:EventProjectStatus
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
        find_event_key_index(sub_admin_account.event_access.clone(),&event_account.key()) != None,
        Errors::InvalidAdmin
    );
    event_join_account.status =status;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateEventJoinContext<'info> {
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
pub struct UpdateEventJoinStatusContext<'info> {
    #[account(mut,
        constraint = sub_admin_account.level > 0 @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(),sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

    #[account(mut,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump  = event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
        seeds = [b"event".as_ref(), event_account.event_key.key().as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.create_key.key().as_ref(), project_account.counter.to_le_bytes().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


pub fn invite_event_join_handler(ctx:Context<InviteEventJoinContext>)-> Result<()>{
    let event_join_account = &mut ctx.accounts.event_join_account;
    let event_account = &mut ctx.accounts.event_account;
    let project_account = &mut ctx.accounts.project_account;

    require!(
        project_account.status != ProjectVerification::Verified,
        Errors::InvalidProjectVerification
    );

    event_join_account.authority = project_account.owner.key();
    event_join_account.donation = 0;
    event_join_account.status = EventProjectStatus::PendingApproval;
    event_join_account.bump = ctx.bumps.event_join_account;

    emit!(NewEventJoin {
        authority: project_account.owner.key(),
        event_account: event_account.key(),
        project_account: project_account.key()
    });
    Ok(())
}

#[derive(Accounts)]
pub struct InviteEventJoinContext<'info>{

     #[account(mut,
        constraint = authority.key() == sub_admin_account.authority.key() @ Errors::InvalidSigner,
        constraint = sub_admin_account.level == 3 @Errors::InvalidAdmin,
    )]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventJoin::INIT_SPACE,
        seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
        bump 
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

   #[account(mut,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), sub_admin_account.create_key.key().as_ref()],
        bump = sub_admin_account.bump
    )]
    pub sub_admin_account: Box<Account<'info, SubAdmin>>,

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