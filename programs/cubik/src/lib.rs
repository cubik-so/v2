use anchor_lang::prelude::*;
mod errors;
use squads_multisig_program::Member;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;
use state::*;

declare_id!("CSgKQkUfuv8YVMiU9j3p34zSDexFHmXjFLxaDvf7KCz7");

#[program]
pub mod cubik {

    use super::*;
}
