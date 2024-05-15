use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct Project {
    /// The public key of the project's creator.
    pub creator: Pubkey,
    /// Current verification status of the project.
    // pub status: ProjectVerification,
    /// Pubkey of the project reciver
    pub reciver: Pubkey,
    /// Public key of the account used to store the project's funds or assets.
    pub vault_pubkey: Pubkey,
    /// Public key used as a seed to generate the project's PDA.
    pub create_key: Pubkey,
    /// metadata of the project.
    #[max_len(50)]
    pub metadata: String, // fix sizing here
    /// Bump for the project PDA seed.
    pub bump: u8,
}

/// Defines possible states of project verification.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug, InitSpace)]
pub enum ProjectVerification {
    /// The project is currently undergoing review.
    UnderReview,
    /// The project has been successfully verified.
    Verified,
    /// Verification of the project failed.
    VerificationFailed,
}

/// Provides a default value for the `ProjectVerification` enum.
impl Default for ProjectVerification {
    fn default() -> Self {
        ProjectVerification::UnderReview
    }
}
