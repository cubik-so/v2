use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct EventJoin {
    pub authority: Pubkey,
    pub status: EventProjectStatus,
    pub donation: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum EventProjectStatus {
    PendingApproval,
    Approved,
    Rejected,
}
impl Default for EventProjectStatus {
    fn default() -> Self {
        EventProjectStatus::PendingApproval
    }
}
