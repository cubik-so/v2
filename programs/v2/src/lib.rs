use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;

declare_id!("3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS");

#[program]
pub mod cubik_v2 {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateUserContext>,
        username: String,
        metadata: String,
    ) -> Result<()> {
        create_user::handler(ctx, username, metadata);
        Ok(())
    }
}
