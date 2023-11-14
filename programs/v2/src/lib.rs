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

    pub fn create_project(
        ctx: Context<CreateProjectContext>,
        counter: u64,
        multi_sig: Pubkey,
        metadata: String,
    ) -> Result<()> {
        create_project::handler(ctx, counter, multi_sig, metadata);
        Ok(())
    }
}
