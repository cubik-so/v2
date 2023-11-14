use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Admin {
    pub authority: Pubkey,
    pub bump: u8,
}
