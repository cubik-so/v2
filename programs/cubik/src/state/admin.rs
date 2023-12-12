use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Admin {
    // ['admin']
    pub authority: Pubkey,
    pub bump: u8,
}
