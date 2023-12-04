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
pub struct SubAdmin {
    pub authority: Pubkey,
    pub permission: AdminPermission,
    pub event: Pubkey,
    pub bump: u8,
}

#[derive(Default, AnchorDeserialize, AnchorSerialize, Clone, InitSpace)]
pub struct AdminPermission {
    // ['admin',authority]
    // event = authority,
    // all true
    pub full: bool,
    // ['admin',authority]
    // event = authority,
    // project status true
    pub project_status: bool,
    // ['admin',authority,event]
    // event = event_key/sponsor_key,
    // event_join true
    pub event_join_status: bool,
}
