use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct SponsorTeam {
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(Default, InitSpace)]
pub struct Sponsor {
    pub authority: Pubkey,
    pub create_key: Pubkey,
    pub multi_sig: Pubkey,
    pub vault_pubkey: Pubkey,
    pub event_account: Pubkey,
    pub bump: u8,
}
