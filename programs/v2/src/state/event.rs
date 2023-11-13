use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Event {
    pub authority: Pubkey,
    pub bump: u8,
}
