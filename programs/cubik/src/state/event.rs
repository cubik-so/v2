use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Event {
    // Owner for the event
    pub authority: Pubkey,
    // Event type
    pub event_type: EventType,
    // Event metadata
    #[max_len(50)]
    pub metadata: String, // todo - fix size
    //  createKey for the event
    pub create_key: Pubkey,
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
