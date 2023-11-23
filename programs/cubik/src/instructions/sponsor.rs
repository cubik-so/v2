use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use anchor_spl::token::{self,Token, TokenAccount, Mint};

use crate::event::*;
use crate::state::{Sponsor, SponsorTeam};




pub fn init_sponsor(ctx: Context<InitSponsorContext>,vault:Pubkey,total_committed: u64,metadata:String) -> Result<()> {


    let sponsor_account = &mut ctx.accounts.sponsor_account;
    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;

    
    sponsor_account.authority = ctx.accounts.authority.key();
    sponsor_account.vault = vault;
    sponsor_account.total_committed_usd = total_committed;
    sponsor_account.total_paid_usd = 0;
    // team account
    emit!(NewSponsor  {
            authority:ctx.accounts.authority.key(),
            metadata:metadata
    });
    sponsor_team_account.authority = ctx.accounts.authority.key();
    sponsor_team_account.bump = *ctx.bumps.get("sponsor_team_account").unwrap();
    sponsor_account.bump = *ctx.bumps.get("sponsor_account").unwrap();
 
    Ok(())
}

pub fn add_member_sponsor(ctx: Context<SponsorTeamContext>,team_member_key:Pubkey) -> Result<()>{

    let sponsor_team_account = &mut ctx.accounts.sponsor_team_account;
    sponsor_team_account.authority = team_member_key.key();
    sponsor_team_account.bump = *ctx.bumps.get("sponsor_team_account").unwrap();

     Ok(())
}

pub fn update_sponsor(ctx: Context<UpdateSponsor>,metadata:String,total_committed: u64) -> Result<()>{
    let sponsor_account = &mut ctx.accounts.sponsor_account;
    sponsor_account.total_committed_usd = total_committed;

    emit!(UpdateSponsorEvent  {
        authority: ctx.accounts.authority.key(),
        metadata,
    });
    
    Ok(())
}

pub fn fund_sponsor_vault_spl(ctx: Context<FundSponsorVaultSPLContext>,amount: u64,amount_usd:u64)-> Result<()>{

     let sponsor_account = &mut ctx.accounts.sponsor_account;

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
     sponsor_account.total_paid_usd += amount_usd ;
     
  Ok(())
}

pub fn fund_sponsor_vault_sol(ctx: Context<FundSponsorVaultSOLContext>,amount: u64,amount_usd:u64)-> Result<()>{
let receiver_account = &mut ctx.accounts.receiver_account;
     let sponsor_account = &mut ctx.accounts.sponsor_account;
   let ix =   system_instruction::transfer(  &ctx.accounts.authority.key(),
            &sponsor_account.vault, amount);

            invoke(
            &ix,
            &[
                ctx.accounts.authority.to_account_info(),
                receiver_account.to_account_info(),
            ],
        );

     sponsor_account.total_paid_usd += amount_usd ;
     
  Ok(())
}



#[derive(Accounts)]
#[instruction(vault:Pubkey)]
pub struct InitSponsorContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Sponsor::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),vault.key().as_ref()],
        bump 
    )]
    pub sponsor_account: Account<'info, Sponsor>,
    #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),vault.key().as_ref(),authority.key().as_ref()],
        bump 
    )]
    pub sponsor_team_account: Account<'info, SponsorTeam>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct UpdateSponsor<'info> {
#[account(mut, constraint = authority.key() == sponsor_team_account.authority.key())]
    pub authority: Signer<'info>,
 #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.vault.key().as_ref()],
        bump 
    )]
    pub sponsor_account: Account<'info, Sponsor>,
    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.vault.key().as_ref(),authority.key().as_ref()],
        bump 
    )]
    pub sponsor_team_account: Account<'info, SponsorTeam>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(team_member_key:Pubkey)]
pub struct  SponsorTeamContext<'info> {
    #[account(mut, constraint = sponsor_account.authority.key() == authority.key())]
    pub authority: Signer<'info>,

      #[account(init,
        payer = authority,
        space = 8 + SponsorTeam::INIT_SPACE,
        seeds = [b"sponsor".as_ref(),sponsor_account.vault.key().as_ref(),team_member_key.key().as_ref()],
        bump 
    )]
    pub sponsor_team_account: Account<'info, SponsorTeam>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.vault.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Account<'info, Sponsor>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct  FundSponsorVaultSPLContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.vault.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Account<'info, Sponsor>,

     #[account(mut)]
    pub token_mint: Account<'info, Mint>,

    #[account(mut, constraint = token_ata_sender.mint ==  token_mint.key(), constraint = token_ata_sender.owner == authority.key())]
    pub token_ata_sender: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = token_ata_receiver.mint ==  token_mint.key(), constraint = token_ata_receiver.owner == sponsor_account.vault.key())]
    pub token_ata_receiver: Box<Account<'info, TokenAccount>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}



#[derive(Accounts)]
pub struct  FundSponsorVaultSOLContext<'info> {


    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"sponsor".as_ref(),sponsor_account.vault.key().as_ref()],
        bump = sponsor_account.bump
    )]
    pub sponsor_account: Account<'info, Sponsor>,

     /// CHECK: Used in trasfer ix
    #[account(mut, constraint= receiver_account.key() == sponsor_account.vault.key())]
    pub receiver_account: AccountInfo<'info>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
     #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}