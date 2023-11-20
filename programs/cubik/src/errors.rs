use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("max length is 32")]
    MaxLengthExceeded,
    #[msg("Signer Mismatch")]
    InvalidSigner,
    #[msg("project not verified")]
    InvalidProjectVerification,
    #[msg("Invalid Admin")]
    InvalidAdmin,
}
