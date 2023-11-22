use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self,Token, TokenAccount, Mint};

use crate::state::Sponsor;




pub fn create_sponsor_sol(ctx: Context<SponsorSOLContext>,vault:Pubkey,token:Pubkey,total_amount:u64,total_amount_paid:u64,amount:u64) -> Result<()> {

     let authority = &mut ctx.accounts.authority;
 let receiver_account = &mut ctx.accounts.receiver_account;
 
     let ix = transfer(
            &authority.key(),
            &vault.key(),
            amount,
        );
      invoke(
            &ix,
            &[
                authority.to_account_info(),
                receiver_account.to_account_info(),
            ],
        );

    let sponsor_account = &mut ctx.accounts.sponsor_account;
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.token = token;
    sponsor_account.total_amount = total_amount;
    sponsor_account.total_amount_paid = total_amount_paid;
    sponsor_account.vault = vault;
    sponsor_account.bump = *ctx.bumps.get("sponsor_account").unwrap();
 
    Ok(())
}



pub fn create_sponsor_spl(ctx: Context<SponsorSPLContext>,vault:Pubkey,token:Pubkey,total_amount:u64,total_amount_paid:u64,amount:u64) -> Result<()> {
    
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

    let sponsor_account = &mut ctx.accounts.sponsor_account;
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.token = token;
    sponsor_account.total_amount = total_amount;
    sponsor_account.total_amount_paid = total_amount_paid;
    sponsor_account.vault = vault;
    sponsor_account.bump = *ctx.bumps.get("sponsor_account").unwrap();
 
    Ok(())
}




#[derive(Accounts)]
#[instruction(vault:Pubkey)]
pub struct SponsorSOLContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),vault.key().as_ref()],
        bump 
    )]
    pub sponsor_account: Account<'info, Sponsor>,


      /// CHECK: Used in trasfer ix
    #[account(mut, constraint= receiver_account.key() == vault.key())]
    pub receiver_account: AccountInfo<'info>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
#[instruction(vault:Pubkey)]
pub struct SponsorSPLContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),vault.key().as_ref()],
        bump 
    )]
    pub sponsor_account: Account<'info, Sponsor>,

     #[account(mut)]
    pub token_mint: Account<'info, Mint>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == vault.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}
