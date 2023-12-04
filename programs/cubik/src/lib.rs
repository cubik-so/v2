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

    pub fn project_status_verified(ctx: Context<UpdateProjectStatusContext>) -> Result<()> {
        verified_status_handler(ctx)?;
        Ok(())
    }

    pub fn project_status_failed(ctx: Context<UpdateProjectStatusContext>) -> Result<()> {
        failed_status_handler(ctx)?;
        Ok(())
    }

    pub fn update_project(ctx: Context<UpdateProjectContext>, metadata: [u8; 32]) -> Result<()> {
        update_project_handler(ctx, metadata)?;
        Ok(())
    }

    pub fn transfer_project(ctx: Context<TransferProjectContext>) -> Result<()> {
        transfer_project_handler(ctx)?;
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
        matching_pool: u64,
        metadata: [u8; 32],
    ) -> Result<()> {
        create_event_handler(ctx, matching_pool, metadata)?;
        Ok(())
    }

    pub fn update_event_join_status_approve(ctx: Context<UpdateEventJoinContext>) -> Result<()> {
        update_approve_handler(ctx)?;
        Ok(())
    }
    pub fn update_event_join_status_rejected(ctx: Context<UpdateEventJoinContext>) -> Result<()> {
        update_reject_handler(ctx)?;
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

    pub fn create_admin(ctx: Context<CreateAdminContext>) -> Result<()> {
        create_admin_handler(ctx)?;
        Ok(())
    }

    pub fn set_sub_admin_project_status_permissions(
        ctx: Context<SetSubAdminEventPermissionsContext>,
        create_key: Pubkey,
        event_key: Pubkey,
    ) -> Result<()> {
        set_sub_admin_project_status_permissions_handler(ctx, create_key, event_key)?;
        Ok(())
    }
    pub fn set_sub_admin_event_permissions(
        ctx: Context<CreateSubAdminEventStatusContext>,
        create_key: Pubkey,
        event_key: Pubkey,
        permission: AdminPermission,
    ) -> Result<()> {
        set_sub_admin_event_permissions_handler(ctx, create_key, event_key, permission)?;
        Ok(())
    }
    pub fn close_sub_admin_event_access(
        ctx: Context<CloseSubAdminEventAccessContext>,
        create_key: Pubkey,
    ) -> Result<()> {
        close_sub_admin_event_access_handler(ctx, create_key)?;
        Ok(())
    }
    pub fn close_sub_admin(ctx: Context<CloseSubAdminContext>, create_key: Pubkey) -> Result<()> {
        close_sub_admin_handler(ctx, create_key)
    }
}
