use anchor_lang::prelude::*;

use crate::state::ProjectVerification;

#[event]
pub struct NewTipSOL {
    pub authority: Pubkey,
    pub amount: u64,
    pub project_create_key: Pubkey,
}
#[event]
pub struct NewTipSPL {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub project_create_key: Pubkey,
    pub amount: u64,
}

#[event]
pub struct NewContributionSOL {
    pub authority: Pubkey,
    pub amount: u64,
    pub event_key: Pubkey,
    pub project_create_key: Pubkey,
}
#[event]
pub struct NewContributionSPL {
    pub authority: Pubkey,
    pub amount: u64,
    pub token: Pubkey,
    pub event_key: Pubkey,
    pub project_create_key: Pubkey,
}
