use anchor_lang::{prelude::*, solana_program::pubkey};

#[account]
#[derive(Default, InitSpace)]
pub struct SubAdmin {
    pub authority: Pubkey,
    pub permission: SubAdminPermission,
    pub create_key: Pubkey,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug, InitSpace)]
pub enum SubAdminPermission {
    GOD,
    Manger,
    EventManger { event: Pubkey },
}

impl Default for SubAdminPermission {
    fn default() -> Self {
        SubAdminPermission::Manger
    }
}

pub fn admin_permission_to_u8(perms: SubAdminPermission) -> u8 {
    match perms {
        SubAdminPermission::Manger => 1,
        SubAdminPermission::EventManger { event } => 1,
        SubAdminPermission::GOD => 2,
    }
}
