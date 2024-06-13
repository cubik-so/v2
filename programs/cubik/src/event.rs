use anchor_lang::prelude::*;

use crate::state::EventProjectStatus;

// Project events
#[event]
pub struct ProjectCreateEvent {
    pub creator: Pubkey,
    pub create_key: Pubkey,
    pub project_account: Pubkey,
    pub metadata: String,
    pub receiver: Pubkey,
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
    pub receiver: Option<Pubkey>,
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

#[event]
pub struct EventCreateEvent {
    pub authority: Pubkey,
    pub metadata: String,
    pub create_key: Pubkey,
    pub event_account: Pubkey,
}
#[event]
pub struct EventParticipantCreateEvent {
    pub authority: Pubkey,
    pub event_participant_account: Pubkey,
}
#[event]
pub struct EventParticipantInviteEvent {
    pub event_team_key: Pubkey,
    pub event_participant_account: Pubkey,
}

#[event]
pub struct EventParticipantUpdateEvent {
    pub event_team_key: Pubkey,
    pub status: EventProjectStatus,
    pub event_participant_account: Pubkey,
}

#[event]
pub struct EventTeamCloseEvent {
    pub authority: Pubkey,
    pub remove_member: Pubkey,
    pub event_account: Pubkey,
}
#[event]
pub struct EventTeamCreateEvent {
    pub authority: Pubkey,
    pub new_event_team_account: Pubkey,
    pub event_account: Pubkey,
}
#[event]
pub struct EventTeamUpdateEvent {
    pub authority: Pubkey,
    pub event_team_account: Pubkey,
    pub metadata: Option<String>,
    pub ending_slot: Option<u64>,
    pub start_slot: Option<u64>,
}

#[event]
pub struct SponsorCreateEvent {
    pub authority: Pubkey,
    pub event_account: Pubkey,
    pub sponsor_account: Pubkey,
    pub create_key: Pubkey,
    pub vault_key: Pubkey,
    pub metadata: String,
}

#[event]
pub struct SponsorCloseEvent {
    pub authority: Pubkey,
    pub sponsor_account: Pubkey,
}
#[event]
pub struct SponsorUpdateEvent {
    pub authority: Pubkey,
    pub sponsor_account: Pubkey,
}
