use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Project {
    pub owner: Pubkey,
    pub status: ProjectVerification,
    pub counter: u64,
    pub multisig: Pubkey,
    pub vault_pubkey: Pubkey,
    pub create_key: Pubkey,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug, InitSpace)]
pub enum ProjectVerification {
    UnderReview,
    Verified,
    VerificationFailed,
}
impl Default for ProjectVerification {
    fn default() -> Self {
        ProjectVerification::UnderReview
    }
}
