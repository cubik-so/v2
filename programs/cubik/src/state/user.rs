use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct User {
    pub authority: Pubkey,
    pub metadata: [u8; 32],
    pub bump: u8,
}
