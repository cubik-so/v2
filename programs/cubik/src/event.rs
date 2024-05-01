use anchor_lang::prelude::*;

use crate::state::ProjectVerification;
#[event]
pub struct NewUser {
    pub authority: Pubkey,
    pub username: String,
}
#[event]
pub struct UpdateUser {
    pub authority: Pubkey,
    pub username: String,
}
#[event]
pub struct NewSponsor {
    pub authority: Pubkey,
    pub event_account: Pubkey,
    pub total_committed: u128,
}

#[event]
pub struct UpdateSponsorEvent {
    pub authority: Pubkey,
}
#[event]
pub struct NewProject {
    pub authority: Pubkey,
    pub counter: u64,
}
#[event]
pub struct UpdateProjectStatus {
    pub authority: Pubkey,
    pub status: ProjectVerification,
}

#[event]
pub struct NewEvent {
    pub authority: Pubkey,
    pub event_key: Pubkey,
}
#[event]
pub struct UpdateEvent {
    pub authority: Pubkey,
}
#[event]
pub struct NewEventJoin {
    pub authority: Pubkey,
    pub project_account: Pubkey,
    pub event_account: Pubkey,
}
#[event]
pub struct UpdateEventJoin {
    pub authority: Pubkey,
    pub metadata: String,
}
#[event]
pub struct NewContributionSOL {
    pub authority: Pubkey,
    pub amount_usd: u64,
    pub amount: u64,
    pub event_join_account: Pubkey,
    pub event_account: Pubkey,
    pub project_account: Pubkey,
}

#[event]
pub struct NewContributionSPL {
    pub amount: u64,
    pub authority: Pubkey,
    pub amount_usd: u64,
    pub token: Pubkey,
    pub event_join_account: Pubkey,
    pub event_account: Pubkey,
    pub project_account: Pubkey,
}

#[event]
pub struct NewDonationSOL {
    pub authority: Pubkey,
    pub amount: u64,
    pub project_create_key: Pubkey,
    pub counter: u64,
}
#[event]
pub struct NewDonationSPL {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub amount: u64,
    pub project_create_key: Pubkey,
    pub counter: u64,
}

#[event]
pub struct NewFundSponsorSOL {
    pub authority: Pubkey,
    pub amount: u64,
}
#[event]
pub struct NewFundSponsorSPL {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub amount: u64,
}

#[event]
pub struct NewTipSOL {
    pub authority: Pubkey,
    pub amount: u64,
}
#[event]
pub struct NewTipSPL {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub amount: u64,
}
