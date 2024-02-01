use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Admin {
    // ['admin']
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(Default, InitSpace)]
pub struct AdminVault {
    pub create_key: Pubkey,
    pub vault_pubkey: Pubkey,
    pub multi_sig: Pubkey,
    pub bump: u8,
}
