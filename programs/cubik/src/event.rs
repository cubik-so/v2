use anchor_lang::prelude::*;

// Project events
#[event]
pub struct ProjectCreateEvent {
    pub creator: Pubkey,
    pub create_key: Pubkey,
    pub project_account: Pubkey,
    pub metadata: String,
    pub reciver: Pubkey,
}
#[event]
pub struct ProjectCloseEvent {
    pub creator: Pubkey,
    pub create_key: Pubkey,
    pub project_account: Pubkey,
}

#[event]
pub struct ProjectTransferEvent {
    pub creator: Pubkey,
    pub new_creator: Pubkey,
    pub create_key: Pubkey,
    pub project_account: Pubkey,
}

#[event]
pub struct ProjectUpdateEvent {
    pub creator: Pubkey,
    pub create_key: Pubkey,
    pub project_account: Pubkey,
    pub metadata: Option<String>,
    pub reciver: Option<Pubkey>,
}

// Tipping events
#[event]
pub struct TipSOLEvent {
    pub authority: Pubkey,
    pub amount: u64,
    pub project_create_key: Pubkey,
}
#[event]
pub struct TipSPLEvent {
    pub authority: Pubkey,
    pub token: Pubkey,
    pub project_create_key: Pubkey,
    pub amount: u64,
}

// Contribution events

#[event]
pub struct ContributionSOLEvent {
    pub authority: Pubkey,
    pub amount: u64,
    pub event_key: Pubkey,
    pub project_create_key: Pubkey,
}
#[event]
pub struct ContributionSPLEvent {
    pub authority: Pubkey,
    pub amount: u64,
    pub token: Pubkey,
    pub event_key: Pubkey,
    pub project_create_key: Pubkey,
}
