use anchor_lang::solana_program::{pubkey, pubkey::Pubkey};

// Constants for the PDA seed.
pub const PROJECT_PREFIX: &[u8] = b"project";
pub const EVENT_PREFIX: &[u8] = b"event";
pub const TEAM_PREFIX: &[u8] = b"team";
pub const EVENT_PARTICIPANT_PREFIX: &[u8] = b"eventparticipant";
pub const ADMIN_PREFIX: &[u8] = b"admin";
pub const SPONSOR_PREFIX: &[u8] = b"sponsor";

pub const CONFIG_AUTHORITY: Pubkey = pubkey!("8qpemLRMyZC4gX34vewYWHfeekKGcHqWzd5etppsQ5tY");

pub const VAULT_AUTHORITY: Pubkey = pubkey!("FERZ4zq1XRdLSoSj3ZGj5pjvSWRudBWAYXk6M5qBsUf2");

pub const MIN_SOL: u64 = 100000; // 0.0001 SOL
