use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Admin {
    pub authority: Pubkey,
    pub bump: u8,
}
#[account]
#[derive(Default, InitSpace)]
pub struct SubAdmin {
    pub authority: Pubkey,
    pub permission: AdminPermission,
    pub event: Pubkey,
    pub bump: u8,
}

#[derive(Default, AnchorDeserialize, AnchorSerialize, Clone, InitSpace)]
pub struct AdminPermission {
    pub full: bool,
    pub project_status: bool,
    pub project_join_status: bool,
}
