#[warn(unused_must_use)]
use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;
use state::*;

// declare_id!("GsKHdvSBodD3ZGMAMWZ6sSwNZAixsE6XZ4xKA4KyEwc");
declare_id!("CUbkXMRWxumGzDwf43ysyFm3da77JRuUqLF1bmW4tGoZ");

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
        rent_collector: Option<Pubkey>,
    ) -> Result<()> {
        create_project_handler(
            ctx,
            counter,
            members_keys,
            threshold,
            config_authority,
            time_lock,
            memo,
            rent_collector,
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

    pub fn create_event_join(ctx: Context<CreateEventJoinContext>) -> Result<()> {
        create_event_join_handler(ctx)?;
        Ok(())
    }

    pub fn create_event(
        ctx: Context<CreateEventContext>,
        matching_pool: u64,
        event_admin_signer: Pubkey,
    ) -> Result<()> {
        create_event_handler(ctx, matching_pool, event_admin_signer)?;
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
        new_sub_admin_authority: Pubkey,
        level: u8,
    ) -> Result<()> {
        create_sub_admin_handler(ctx, new_sub_admin_authority, level)?;
        Ok(())
    }
    pub fn close_sub_admin(ctx: Context<CloseSubAdminContext>) -> Result<()> {
        close_sub_admin_handler(ctx)?;
        Ok(())
    }

    pub fn update_sub_admin_level(
        ctx: Context<UpdateLevelSubAdminContext>,
        level: u8,
    ) -> Result<()> {
        update_sub_admin_level_handler(ctx, level)?;
        Ok(())
    }

    pub fn add_event_access(ctx: Context<AddEventAccessContext>) -> Result<()> {
        add_event_access_handler(ctx)?;
        Ok(())
    }
    pub fn remove_event_access(ctx: Context<RemoveEventAccessContext>) -> Result<()> {
        remove_event_access_handler(ctx)?;
        Ok(())
    }

    pub fn init_sponsor_with_self_custody(
        ctx: Context<InitSponsorWithSelfCustodyContext>,
        total_committed: u128,
        members_keys: Vec<Pubkey>,
        threshold: u16,
        config_authority: Option<Pubkey>,
    ) -> Result<()> {
        init_sponsor_with_self_custody_handler(
            ctx,
            total_committed,
            members_keys,
            threshold,
            config_authority,
        )?;
        Ok(())
    }

    pub fn init_sponsor_without_self_custody(
        ctx: Context<InitSponsorWithoutSelfCustodyContext>,
        total_committed: u128,
    ) -> Result<()> {
        init_sponsor_without_self_custody_handler(ctx, total_committed)?;
        Ok(())
    }

    pub fn init_cubik_sponsor(
        ctx: Context<InitCubikSponsorContext>,
        total_committed: u128,
        members_keys: Vec<Pubkey>,
        threshold: u16,
        config_authority: Option<Pubkey>,
    ) -> Result<()> {
        init_cubik_sponsor_handler(
            ctx,
            total_committed,
            members_keys,
            threshold,
            config_authority,
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

    pub fn donate_spl(ctx: Context<DonationSPLContext>, amount: u64) -> Result<()> {
        donation_spl_handler(ctx, amount)?;
        Ok(())
    }

    pub fn donate_sol(ctx: Context<DonationSOLContext>, amount: u64) -> Result<()> {
        donation_sol_handler(ctx, amount)?;
        Ok(())
    }

    pub fn contribution_sol(ctx: Context<ContributionSOL>, amount: u64) -> Result<()> {
        contribution_sol_handler(ctx, amount)?;
        Ok(())
    }
    pub fn contribution_spl(ctx: Context<ContributionSPL>, amount: u64) -> Result<()> {
        contribution_spl_handler(ctx, amount)?;
        Ok(())
    }
}
