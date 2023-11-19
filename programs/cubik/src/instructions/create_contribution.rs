use crate::event::NewContribution;
use crate::state::{Admin, Event, EventJoin, Project};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self, Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(amount: u64,split: u64,create_key: Pubkey)]
pub struct CreateContributionContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub token_mint: Account<'info, Mint>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == project_account.multisig.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_admin.mint ==  token_mint.key(), constraint = token_ata_admin.owner == admin_account.authority.key())]
    pub token_ata_admin: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump
    )]
    pub admin_account: Account<'info, Admin>,

    #[account(mut,
        seeds = [b"project".as_ref(),project_account.owner.key().as_ref(),&project_account.counter.to_le_bytes()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,seeds=[b"event", event_account.event_key.key().as_ref()],bump=event_account.bump)]
    pub event_account: Box<Account<'info, Event>>,

    #[account(mut,
    seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
    bump= event_join_account.bump
    )]
    pub event_join_account: Box<Account<'info, EventJoin>>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateContributionContext>,
    amount: u64,
    split: u64,
    create_key: Pubkey,
) -> Result<()> {
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

    if split > 0 {
        //  put the split logic here
    }

    emit!(NewContribution {
        user: ctx.accounts.authority.key(),
        create_key: create_key,
        amount: amount,
        split: split,
        event_account: ctx.accounts.event_account.key(),
        event_join_account: ctx.accounts.event_join_account.key(),
        project_account: ctx.accounts.project_account.key()
    });

    Ok(())
}
