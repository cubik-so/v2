use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Error: Mismatch in signer credentials")]
    InvalidSigner,
    #[msg("Error: Invalid Signer")]
    InvalidProjectVerification,
    #[msg("Error: Admin credentials invalid or not recognized")]
    InvalidAdmin,
    #[msg("Error: Invalid Event Key")]
    InvalidEventKey,
    #[msg("Error: Unauthorized access attempt detected")]
    Permission,
    #[msg("Error: Owner of project cannot tip the Project itself")]
    InvalidTip,
    #[msg("Error: Invalid receiver")]
    InvalidReceiver,
    #[msg("Error: Invalid Members Length")]
    InvalidMembersLength,
    #[msg("Error: Invalid Project Creator")]
    InvalidProjectCreator,
    #[msg("Error: Invalid Event Creator")]
    InvalidEventCreator,
    #[msg("Error: Amount too low")]
    AmountTooLow,
}
