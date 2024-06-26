use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Event {
    // Owner for the event
    pub authority: Pubkey,
    // Event type
    pub event_type: EventType,
    // Event metadata
    #[max_len(30)]
    pub metadata: String,
    //  createKey for the event
    pub create_key: Pubkey,
    // Voting Start slot
    pub start_slot: u64,
    // Voting Ending slot
    pub ending_slot: u64,

    // Vault Pubkey
    pub vault_pubkey: Pubkey,
    // Bump for the event PDA seed
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug, InitSpace)]
pub enum EventType {
    QFROUND,
    RPGF,
}
impl Default for EventType {
    fn default() -> Self {
        EventType::QFROUND
    }
}

#[account]
#[derive(Default, InitSpace)]
pub struct EventTeam {
    // Event account
    pub authority: Pubkey,
    // Team name
    pub bump: u8,
}
