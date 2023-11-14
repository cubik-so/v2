use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Event {
    pub authority: Pubkey,
    pub matching_pool: u64,
    pub bump: u8,
}
