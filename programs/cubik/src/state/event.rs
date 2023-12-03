use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Event {
    pub authority: Pubkey,
    pub matching_pool: u64,
    pub event_key: Pubkey,
    pub metadata: [u8; 32],
    pub bump: u8,
}
