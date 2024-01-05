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
    pub total_committed_usd: u64,
    pub bump: u8,
}
