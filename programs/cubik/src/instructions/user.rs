use crate::errors::Errors;
use crate::event::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};

pub fn create_user_handler(
    ctx: Context<CreateUserContext>,
    username: String,
) -> Result<()> {
    require!(username.len() <= 32, Errors::MaxLengthExceeded);

    let user_account = &mut ctx.accounts.user_account;
    
    user_account.authority = ctx.accounts.authority.key();

    user_account.bump = ctx.bumps.user_account;

    emit!(NewUser {
        authority: ctx.accounts.authority.key(),
        username,
    });
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
    pub user_account: Box<Account<'info, User>>,

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
