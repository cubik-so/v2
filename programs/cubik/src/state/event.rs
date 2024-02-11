use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Event {
    pub authority: Pubkey,
    pub matching_pool: u64,
    pub event_admin_signer: Pubkey,
    pub event_key: Pubkey,
    pub bump: u8,
}
