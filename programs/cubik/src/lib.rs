#[warn(unused_must_use)]

use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;
use state::*;

declare_id!("CSgKQkUfuv8YVMiU9j3p34zSDexFHmXjFLxaDvf7KCz7");

#[program]
pub mod cubik {

    use super::*;

    pub fn create_user(ctx: Context<CreateUserContext>,username:String,metadata:String)-> Result<()>{

    handler_create_user(ctx, username,metadata)?;
    Ok(())
    }
}
