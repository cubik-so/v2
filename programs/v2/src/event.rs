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
