use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct EventJoin {
    pub authority: Pubkey,
    pub status: RoundProjectStatus,
    pub donation: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum RoundProjectStatus {
    PendingApproval,
    Approved,
    Rejected,
}
impl Default for RoundProjectStatus {
    fn default() -> Self {
        RoundProjectStatus::PendingApproval
    }
}
