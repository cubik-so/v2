use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct SubAdmin {
    pub authority: Pubkey,
    // 1 = event-manger,
    // 2 = manger,
    // 3 = admin,
    pub level: u8,
    pub create_key: Pubkey,
    #[max_len(10)]
    pub event_access: Vec<Pubkey>,
    pub bump: u8,
}

pub fn find_event_key_index(event_access: Vec<Pubkey>, event_key: &Pubkey) -> Option<usize> {
    event_access.iter().position(|key| key == event_key)
}
