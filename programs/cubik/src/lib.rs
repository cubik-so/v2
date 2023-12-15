#[warn(unused_must_use)]
use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;
use state::*;

// declare_id!("CSgKQkUfuv8YVMiU9j3p34zSDexFHmXjFLxaDvf7KCz7");
declare_id!("3s9zZaosL6hJFeDToXDoPN4sQgyVwLEdqzaztZXj1Nnk");

#[program]
pub mod cubik {

    use super::*;

    pub fn create_user(
        ctx: Context<CreateUserContext>,
        username: String,
        metadata: [u8; 32],
    ) -> Result<()> {
        create_user_handler(ctx, username, metadata)?;
        Ok(())
    }

    pub fn update_user(ctx: Context<UpdateUserContext>, metadata: [u8; 32]) -> Result<()> {
        update_user_handler(ctx, metadata)?;
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

    pub fn update_project_status(
        ctx: Context<UpdateProjectStatusContext>,
        status: ProjectVerification,
    ) -> Result<()> {
        project_status_handler(ctx, status)?;
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
        ctx: Context<CreateEventJoinContext>,
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

    pub fn update_event_join_status(
        ctx: Context<UpdateEventJoinStatusContext>,
        status: EventProjectStatus,
    ) -> Result<()> {
        update_event_status_handler(ctx, status)?;
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

    pub fn invite_event_join(ctx: Context<InviteEventJoinContext>) -> Result<()> {
        invite_event_join_handler(ctx)?;
        Ok(())
    }
    pub fn create_sub_admin(
        ctx: Context<CreateSubAdminContext>,
        status: SubAdminPermission,
        new_sub_admin_authority: Pubkey,
    ) -> Result<()> {
        create_sub_admin_handler(ctx, status, new_sub_admin_authority)?;
        Ok(())
    }
    pub fn close_sub_admin(ctx: Context<CloseSubAdminContext>) -> Result<()> {
        close_sub_admin_handler(ctx)?;
        Ok(())
    }

    pub fn init_sponsor(
        ctx: Context<InitSponsorContext>,
        vault: Pubkey,
        total_committed: u64,
        metadata: String,
    ) -> Result<()> {
        init_sponsor_handler(ctx, vault, total_committed, metadata)?;
        Ok(())
    }

    pub fn add_member_sponsor(
        ctx: Context<SponsorTeamContext>,
        team_member_key: Pubkey,
    ) -> Result<()> {
        add_member_sponsor_handler(ctx, team_member_key)?;
        Ok(())
    }

    pub fn update_sponsor(
        ctx: Context<UpdateSponsor>,
        metadata: String,
        total_committed: u64,
    ) -> Result<()> {
        update_sponsor_handler(ctx, metadata, total_committed)?;
        Ok(())
    }

    pub fn fund_sponsor_vault_spl(
        ctx: Context<FundSponsorVaultSPLContext>,
        amount: u64,
        amount_usd: u64,
    ) -> Result<()> {
        fund_sponsor_vault_spl_handler(ctx, amount, amount_usd)?;
        Ok(())
    }

    pub fn fund_sponsor_vault_sol(
        ctx: Context<FundSponsorVaultSOLContext>,
        amount: u64,
        amount_usd: u64,
    ) -> Result<()> {
        fund_sponsor_vault_sol_handler(ctx, amount, amount_usd)
    }

    pub fn create_contribution(
        ctx: Context<CreateContributionContext>,
        amount: u64,
        split: u64,
        create_key: Pubkey,
    ) -> Result<()> {
        create_contribution_handler(ctx, amount, split, create_key)?;
        Ok(())
    }
}
