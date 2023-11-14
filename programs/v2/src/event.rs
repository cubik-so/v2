use anchor_lang::prelude::*;

#[event]
pub struct NewUser {
    pub authority: Pubkey,
    pub metadata: String,
}
