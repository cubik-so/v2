use anchor_lang::prelude::*;

use crate::state::ProjectVerification;
#[event]
pub struct NewUser {
    pub authority: Pubkey,
    pub metadata: String,
}
#[event]
pub struct NewProject {
    pub authority: Pubkey,
    pub counter: u64,
    pub metadata: String,
}
#[event]
pub struct UpdateProjectStatus {
    pub authority: Pubkey,
    pub status: ProjectVerification,
}
#[event]
pub struct NewEvent {
    pub authority: Pubkey,
    pub metadata: String,
    pub event_key: Pubkey,
}
#[event]
pub struct UpdateEvent {
    pub authority: Pubkey,
    pub metadata: String,
}
#[event]
pub struct NewEventJoin {
    pub authority: Pubkey,
    pub metadata: String,
}
#[event]
pub struct UpdateEventJoin {
    pub authority: Pubkey,
    pub metadata: String,
}
