use crate::errors::Errors;
use crate::event::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn handler_create_user(
    ctx: Context<CreateUserContext>,
    username: String,
    metadata: [u8; 32],
) -> Result<()> {
    require!(username.len() <= 32, Errors::MaxLengthExceeded);

    let user_account = &mut ctx.accounts.user_account;
    user_account.authority = ctx.accounts.authority.key();
    user_account.metadata = metadata;

    user_account.bump = *ctx.bumps.get("user_account").unwrap();

    emit!(NewUser {
        authority: ctx.accounts.authority.key(),
        metadata: metadata,
        username,
    });
    Ok(())
}

pub fn handler_update_user(ctx: Context<UpdateUserContext>, metadata: [u8; 32]) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    user_account.metadata = metadata;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateUserContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + User::INIT_SPACE,
        seeds = [b"user".as_ref(),authority.key().as_ref()],
        bump 
    )]
    pub user_account: Account<'info, User>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateUserContext<'info> {
    #[account(mut,constraint = authority.key() == user_account.authority.key())]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds = [b"user".as_ref(),authority.key().as_ref()],
        bump  = user_account.bump
    )]
    pub user_account: Account<'info, User>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

// #[derive(Accounts)]
// pub struct TransferUserContext<'info>{
//     #[account(mut,constraint = authority.key() == user_account.authority.key())]
//     pub authority: Signer<'info>,

//     #[account(mut,
//         seeds = [b"user".as_ref(),authority.key().as_ref()],
//         bump  = user_account.bump
//     )]
//     pub user_account: Account<'info, User>,

//      #[account(init,
//         payer = authority,
//         space = 8 + User::INIT_SPACE,
//         seeds = [b"user".as_ref(),authority.key().as_ref()],
//         bump
//     )]
//     pub new_user_account: Account<'info, User>,

//     // Misc Accounts
//     #[account(address = system_program::ID)]
//     pub system_program: Program<'info, System>,
//     #[account(address = solana_program::sysvar::rent::ID)]
//     pub rent: Sysvar<'info, Rent>,
// }
