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

    pub fn update_project_status_verified(
        ctx: Context<UpdateProjectContext>,
        counter: u64,
        owner: Pubkey,
    ) -> Result<()> {
        update_project_status::verified_handler(ctx, counter, owner);
        Ok(())
    }
    pub fn update_project_status_failed(
        ctx: Context<UpdateProjectContext>,
        counter: u64,
        owner: Pubkey,
    ) -> Result<()> {
        update_project_status::verification_failed_handler(ctx, counter, owner);
        Ok(())
    }

    pub fn create_event(
        ctx: Context<CreateEventContext>,
        event_key: Pubkey,
        matching_pool: u64,
        metadata: String,
    ) -> Result<()> {
        create_event::handler(ctx, event_key, matching_pool, metadata)
    }
    pub fn update_event(
        ctx: Context<UpdateEventContext>,
        event_key: Pubkey,
        matching_pool: u64,
        metadata: String,
    ) -> Result<()> {
        update_event::handler(ctx, event_key, matching_pool, metadata)
    }

    pub fn create_event_join(
        ctx: Context<EventJoinContext>,
        counter: u64,
        event_key: Pubkey,
        metadata: String,
    ) -> Result<()> {
        create_event_join::handler(ctx, counter, event_key, metadata)
    }
    pub fn approve_event_join(
        ctx: Context<UpdateEventJoinContext>,
        counter: u64,
        event_key: Pubkey,
        owner: Pubkey,
    ) -> Result<()> {
        update_event_join::update_approve_handler(ctx, counter, event_key, owner)
    }
    pub fn rejected_event_join(
        ctx: Context<UpdateEventJoinContext>,
        counter: u64,
        event_key: Pubkey,
        owner: Pubkey,
    ) -> Result<()> {
        update_event_join::update_reject_handler(ctx, counter, event_key, owner)
    }
}
