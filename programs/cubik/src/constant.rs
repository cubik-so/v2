use std::str::FromStr;

use anchor_lang::solana_program::{native_token::LAMPORTS_PER_SOL, pubkey::Pubkey};

// Constants for the PDA seed.
pub const PROJECT_PREFIX: &[u8] = b"project";
pub const EVENT_PREFIX: &[u8] = b"event";

// Variables
pub const CONFIG_AUTHORITY: Pubkey =
    Pubkey::from_str("8qpemLRMyZC4gX34vewYWHfeekKGcHqWzd5etppsQ5tY").unwrap();
pub const VAULT_AUTHORITY: Pubkey =
    Pubkey::from_str("FERZ4zq1XRdLSoSj3ZGj5pjvSWRudBWAYXk6M5qBsUf2").unwrap();

pub const MIN_SOL: u64 = 100000; // 0.0001 SOL
pub const MIN_USD: u64 = 100; // 0.01 USD Assuming 1 USD = 1000000
