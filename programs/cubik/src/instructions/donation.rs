use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_lang::{
    accounts::signer::Signer, context::Context, solana_program::account_info::AccountInfo,
};
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::event::{NewDonationSOL, NewDonationSPL};
use crate::{Project, User};

pub fn donation_sol_handler(ctx: Context<DonationSOLContext>, amount: u64) -> Result<()> {
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

    emit!(NewDonationSOL {
        authority: ctx.accounts.authority.key(),
        amount: amount,
    });

    Ok(())
}

pub fn donation_spl_handler(ctx: Context<DonationSPLContext>, amount: u64) -> Result<()> {
    let sender_ata = &ctx.accounts.token_ata_sender;
    let receiver_ata = &ctx.accounts.token_ata_sender;

    let transfer_instruction = anchor_spl::token::Transfer {
        from: sender_ata.to_account_info(),
        to: receiver_ata.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    let cpi_ctx_trans = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );
    anchor_spl::token::transfer(cpi_ctx_trans, amount)?;

    emit!(NewDonationSPL {
        authority: ctx.accounts.authority.key(),
        amount: amount,
        token: ctx.accounts.token_mint.key(),
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u64,create_key: Pubkey)]
pub struct DonationSOLContext<'info> {
    #[account(mut, constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    #[account(mut, constraint = project_account.vault_pubkey.key() == receiver.key())]
    pub receiver: AccountInfo<'info>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.owner.key().as_ref(),&project_account.counter.to_le_bytes()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64,create_key: Pubkey)]
pub struct DonationSPLContext<'info> {
    #[account(mut, constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == project_account.vault_pubkey.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        seeds = [b"user".as_ref(),user_account.authority.key().as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.owner.key().as_ref(),&project_account.counter.to_le_bytes()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
