use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, InitSpace, Eq, PartialEq, Clone)]
pub struct Member {
    pub key: Pubkey,
    pub permissions: Permissions,
}

#[derive(Clone, Copy)]
pub enum Permission {
    Initiate = 1 << 0,
    Vote = 1 << 1,
    Execute = 1 << 2,
}

/// Bitmask for permissions.
#[derive(
    AnchorSerialize, AnchorDeserialize, InitSpace, Eq, PartialEq, Clone, Copy, Default, Debug,
)]
pub struct Permissions {
    pub mask: u8,
}
