use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Error: Maximum length of 32 characters exceeded")]
    MaxLengthExceeded,
    #[msg("Error: Mismatch in signer credentials")]
    InvalidSigner,
    #[msg("Error: Project verification failed or not present")]
    InvalidProjectVerification,
    #[msg("Error: Admin credentials invalid or not recognized")]
    InvalidAdmin,
    #[msg("Error: Unauthorized access attempt detected")]
    Permission,
}
