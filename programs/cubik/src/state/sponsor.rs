use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Sponsor {
    pub authority: Pubkey,
    pub vault: Pubkey,
    pub bump: u8,
}
