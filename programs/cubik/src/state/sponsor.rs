use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Sponsor {
    pub authority: Pubkey,
    pub event_account: Pubkey,
    pub create_key: Pubkey,
    #[max_len(30)]
    pub metadata: String,
    pub vault_key: Pubkey,
    pub bump: u8,
}
