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
pub struct AdminUser {
    pub authority: Pubkey,
    pub is_admin: bool,
    pub bump: u8,
}

#[account]
#[derive(Default, InitSpace)]
pub struct AdminEvent {
    pub authority: Pubkey,
    pub is_admin: bool,
    pub event: Pubkey,
    pub bump: u8,
}
