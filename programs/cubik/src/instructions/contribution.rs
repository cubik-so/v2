use crate::errors::Errors;
use crate::event::NewContribution;
use crate::state::{Event, EventJoin, EventProjectStatus, Project, ProjectVerification};
use crate::User;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self, Mint, Token, TokenAccount};

pub fn contribution_spl_handler(
    ctx: Context<ContributionSPL>,
    amount: u64,
    split: u64,
) -> Result<()> {
    let event_join = &mut ctx.accounts.event_join_account.clone();
    let project_account = &ctx.accounts.project_account.clone();
    require!(
        event_join.status != EventProjectStatus::Approved,
        Errors::InvalidProjectVerification
    );

    require!(
        project_account.status != ProjectVerification::Verified,
        Errors::InvalidProjectVerification
    );

    let transfer_instruction = anchor_spl::token::Transfer {
        from: ctx.accounts.token_ata_sender.to_account_info(),
        to: ctx.accounts.token_ata_receiver.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    let cpi_ctx_trans = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );

    anchor_spl::token::transfer(cpi_ctx_trans, amount)?;

    event_join.donation = event_join.donation + amount;

    emit!(NewContribution {
        user: ctx.accounts.authority.key(),
        amount: amount,
        split: split,
        event_account: ctx.accounts.event_account.key(),
        event_join_account: ctx.accounts.event_join_account.key(),
        project_account: ctx.accounts.project_account.key()
    });

    Ok(())
}

pub fn contribution_sol_handler(
    ctx: Context<ContributionSOL>,
    amount: u64,
    split: u64,
) -> Result<()> {
    let project_account = &ctx.accounts.project_account;
    let receiver = &ctx.accounts.receiver;
    let transfer_instruction = system_instruction::transfer(
        ctx.accounts.authority.key,
        &project_account.vault_pubkey,
        amount,
    );

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            ctx.accounts.authority.to_account_info(),
            receiver.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    emit!(NewContribution {
        user: ctx.accounts.authority.key(),
        amount: amount,
        split: split,
        event_account: ctx.accounts.event_account.key(),
        event_join_account: ctx.accounts.event_join_account.key(),
        project_account: ctx.accounts.project_account.key()
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u64,split: u64)]
pub struct ContributionSPL<'info> {
    #[account(mut, constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == project_account.vault_pubkey.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.owner.key().as_ref(),&project_account.counter.to_le_bytes()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds=[b"event", event_account.event_key.key().as_ref()],
        bump=event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
    seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
    bump= event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64,split: u64)]
pub struct ContributionSOL<'info> {
    #[account(mut, constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    /// CHECK: Receiver is the project vault
    #[account(mut, constraint = project_account.vault_pubkey.key() == receiver.key())]
    pub receiver: AccountInfo<'info>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.owner.key().as_ref(),&project_account.counter.to_le_bytes()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds=[b"event", event_account.event_key.key().as_ref()],
        bump=event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
    seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
    bump= event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
