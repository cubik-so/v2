use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Admin {
    pub authority: Pubkey,
    #[max_len(6)]
    pub managers: Vec<Pubkey>,
    pub bump: u8,
}

pub fn find_key(keys: Vec<Pubkey>, key: Pubkey) -> Option<Pubkey> {
    keys.into_iter().find(|k| *k == key)
}
