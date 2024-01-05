use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Error: Maximum length of 32 characters exceeded")]
    MaxLengthExceeded,
    #[msg("Error: Mismatch in signer credentials")]
    InvalidSigner,
    #[msg("Error: Invalid Signer")]
    InvalidProjectVerification,
    #[msg("Error: Admin credentials invalid or not recognized")]
    InvalidAdmin,
    #[msg("Error: Unauthorized access attempt detected")]
    Permission,
    #[msg("Error: Owner of project cannot tip the Project itself")]
    InvalidTip,
    #[msg("Error: Invalid receiver")]
    InvalidReceiver,
}
