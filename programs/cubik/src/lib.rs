use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("ADohpkV8Cm4vzPGss4977oncQwD7R6Ac66iw6t4sZWmc");
// declare_id!("CUbkXMRWxumGzDwf43ysyFm3da77JRuUqLF1bmW4tGoZ");

#[program]
pub mod cubik {

    use super::*;

    // Create Project Account with squads
    pub fn project_create(ctx: Context<ProjectCreate>, args: ProjectCreateArgs) -> Result<()> {
        ProjectCreate::project_create(ctx, args)?;
        Ok(())
    }

    // Update Project Account
    pub fn project_update(ctx: Context<ProjectUpdate>, args: ProjectUpdateArgs) -> Result<()> {
        ProjectUpdate::project_update(ctx, args)?;
        Ok(())
    }

    // Transfer Project Account to new Wallet
    pub fn project_transfer(
        ctx: Context<ProjectTransfer>,
        args: ProjectTransferArgs,
    ) -> Result<()> {
        ProjectTransfer::project_transfer(ctx, args)?;
        Ok(())
    }

    // Closing Project Account
    pub fn project_close(ctx: Context<ProjectClose>) -> Result<()> {
        ProjectClose::project_close(ctx)?;
        Ok(())
    }

    // Updates Admin Config
    pub fn admin_config(ctx: Context<AdminConfig>, args: AdminConfigArgs) -> Result<()> {
        AdminConfig::admin_config(ctx, args)?;
        Ok(())
    }

    // Creates Admin Account
    pub fn admin_create(ctx: Context<AdminCreate>) -> Result<()> {
        AdminCreate::admin_create(ctx)?;
        Ok(())
    }

    // Creates Event Account
    pub fn event_create(ctx: Context<EventCreate>, args: EventCreateArgs) -> Result<()> {
        EventCreate::event_create(ctx, args)?;
        Ok(())
    }

    pub fn event_update(ctx: Context<EventUpdate>, args: EventUpdateArgs) -> Result<()> {
        EventUpdate::event_update(ctx, args)?;
        Ok(())
    }
}
