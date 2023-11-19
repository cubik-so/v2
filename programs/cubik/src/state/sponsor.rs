use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Sponsor {
    pub authority: Pubkey,
    pub total_amount: u64,
    pub total_amount_paid: u64,
    pub token: Pubkey,
    pub vault: Pubkey,
    pub bump: u8,
}
