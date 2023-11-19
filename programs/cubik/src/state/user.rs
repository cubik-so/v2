use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct User {
    pub authority: Pubkey,
    pub bump: u8,
}
