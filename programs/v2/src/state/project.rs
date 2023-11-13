use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Project {
    pub owner: Pubkey,
    pub authority: Pubkey,
    pub status: ProjectVerification,
    pub multisig: Pubkey,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum ProjectVerification {
    REVIEW,
    VERIFIED,
    FAILED,
}
impl Default for ProjectVerification {
    fn default() -> Self {
        ProjectVerification::REVIEW
    }
}
