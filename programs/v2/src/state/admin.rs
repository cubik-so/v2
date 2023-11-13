use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Admin {
    pub authority: Pubkey,
    pub bump: u8,
}
