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

    pub fn create_user(
        ctx: Context<CreateUserContext>,
        username: String,
        metadata: [u8; 32],
    ) -> Result<()> {
        handler_create_user(ctx, username, metadata)?;
        Ok(())
    }

    pub fn update_user(ctx: Context<UpdateUserContext>, metadata: [u8; 32]) -> Result<()> {
        handler_update_user(ctx, metadata)?;
        Ok(())
    }

    pub fn create_project(
        ctx: Context<CreateProjectContext>,
        counter: u64,
        multi_sig: Pubkey,
        metadata: [u8; 32],
    ) -> Result<()> {
        create_project_handler(ctx, counter, multi_sig, metadata)?;
        Ok(())
    }

    pub fn project_status_verified(
        ctx: Context<UpdateProjectStatusContext>,
        _counter: u64,
    ) -> Result<()> {
        verified_status_handler(ctx, _counter)?;
        Ok(())
    }

    pub fn project_status_failed(
        ctx: Context<UpdateProjectStatusContext>,
        _counter: u64,
    ) -> Result<()> {
        failed_status_handler(ctx, _counter)?;
        Ok(())
    }

    pub fn update_project(
        ctx: Context<UpdateProjectContext>,
        _counter: u64,
        metadata: [u8; 32],
    ) -> Result<()> {
        update_project_handler(ctx, _counter, metadata)?;
        Ok(())
    }

    pub fn transfer_project(ctx: Context<TransferProjectContext>, _counter: u64) -> Result<()> {
        transfer_project_handler(ctx, _counter)?;
        Ok(())
    }

    pub fn create_event_join(
        ctx: Context<EventJoinContext>,
        counter: u64,
        event_key: Pubkey,
    ) -> Result<()> {
        create_event_join_handler(ctx, counter, event_key)?;
        Ok(())
    }

    pub fn create_event(
        ctx: Context<CreateEventContext>,
        event_key: Pubkey,
        matching_pool: u64,
        metadata: [u8; 32],
    ) -> Result<()> {
        create_event_handler(ctx, event_key, matching_pool, metadata);
        Ok(())
    }

    pub fn update_event_join_status_approve(
        ctx: Context<UpdateEventJoinContext>,
        counter: u64,
        event_key: Pubkey,
    ) -> Result<()> {
        update_approve_handler(ctx, counter, event_key)?;
        Ok(())
    }
    pub fn update_event_join_status_rejected(
        ctx: Context<UpdateEventJoinContext>,
        counter: u64,
        event_key: Pubkey,
    ) -> Result<()> {
        update_reject_handler(ctx, counter, event_key)?;
        Ok(())
    }

    pub fn update_event(
        ctx: Context<UpdateEventContext>,
        matching_pool: u64,
        metadata: [u8; 32],
    ) -> Result<()> {
        update_event_handler(ctx, matching_pool, metadata)?;
        Ok(())
    }
}
