#[warn(unused_must_use)]
use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;
use state::*;

// declare_id!("CSgKQkUfuv8YVMiU9j3p34zSDexFHmXjFLxaDvf7KCz7");
declare_id!("D4QbbabmtqmkjJFcE2qnHihuXa4NT7Ap2tqqh5nyCG4T");

#[program]
pub mod cubik {

    use super::*;

    pub fn create_user(ctx: Context<CreateUserContext>, username: String) -> Result<()> {
        create_user_handler(ctx, username)?;
        Ok(())
    }

    pub fn create_project(
        ctx: Context<CreateProjectContext>,
        counter: u64,
        members_keys: Vec<Pubkey>,
        threshold: u16,
        config_authority: Option<Pubkey>,
        time_lock: u32,
        memo: Option<String>,
    ) -> Result<()> {
        create_project_handler(
            ctx,
            counter,
            members_keys,
            threshold,
            config_authority,
            time_lock,
            memo,
        )?;
        Ok(())
    }

    pub fn update_project_status(
        ctx: Context<UpdateProjectStatusContext>,
        status: ProjectVerification,
    ) -> Result<()> {
        project_status_handler(ctx, status)?;
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

    pub fn create_event(ctx: Context<CreateEventContext>, matching_pool: u64) -> Result<()> {
        create_event_handler(ctx, matching_pool)?;
        Ok(())
    }

    pub fn update_event_join_status(
        ctx: Context<UpdateEventJoinStatusContext>,
        status: EventProjectStatus,
    ) -> Result<()> {
        update_event_status_handler(ctx, status)?;
        Ok(())
    }

    pub fn update_event(ctx: Context<UpdateEventContext>, matching_pool: u64) -> Result<()> {
        update_event_handler(ctx, matching_pool)?;
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
        total_committed: u128,
        members_keys: Vec<Pubkey>,
        threshold: u16,
        config_authority: Option<Pubkey>,
        time_lock: u32,
        memo: Option<String>,
    ) -> Result<()> {
        init_sponsor_handler(
            ctx,
            total_committed,
            members_keys,
            threshold,
            config_authority,
            time_lock,
            memo,
        )?;
        Ok(())
    }

    pub fn add_member_sponsor(
        ctx: Context<SponsorTeamContext>,
        team_member_key: Pubkey,
    ) -> Result<()> {
        add_member_sponsor_handler(ctx, team_member_key)?;
        Ok(())
    }

    pub fn remove_member_sponsor(
        ctx: Context<CloseSponsorTeamContext>,
        team_member_key: Pubkey,
    ) -> Result<()> {
        remove_member_sponsor_handler(ctx, team_member_key)?;
        Ok(())
    }

    pub fn fund_sponsor_spl(ctx: Context<FundSponsorSpl>, amount: u64) -> Result<()> {
        fund_sponsor_spl_handler(ctx, amount)?;
        Ok(())
    }
    pub fn fund_sponsor_sol(ctx: Context<FundSponsorSol>, amount: u64) -> Result<()> {
        fund_sponsor_sol_handler(ctx, amount)?;
        Ok(())
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
