use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct EventJoin {
    pub authority: Pubkey,
    pub status: RoundProjectStatus,
    pub donation: u128,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum RoundProjectStatus {
    PENDING,
    APPROVED,
    REJECTED,
}
impl Default for RoundProjectStatus {
    fn default() -> Self {
        RoundProjectStatus::PENDING
    }
}
