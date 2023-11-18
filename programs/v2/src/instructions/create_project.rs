use crate::event::NewProject;
use crate::state::{user, Admin, Project, ProjectVerification, User};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use squads_multisig_program::{self, cpi, Member, Multisig, MultisigCreate};

#[derive(Accounts)]
#[instruction( 
    counter: u64,
    multi_sig: Pubkey,
    metadata: String,
    members: Vec<Member>,
    threshold: u16,
    config_authority: Option<Pubkey>,
    time_lock: u32,
    memo: Option<String>
)]
pub struct CreateProjectContext<'info> {
    #[account(mut)]
    pub owners: Signer<'info>,

    #[account(init,
        payer = owners,
        space = 8 + Project::INIT_SPACE,
        seeds = [b"project".as_ref(),owners.key().as_ref(),&counter.to_le_bytes()],
        bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    #[account(mut,
        seeds = [b"admin".as_ref()],
        bump = admin_account.bump
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    #[account(mut,
    seeds = [b"user".as_ref(),owners.key().as_ref()],
    bump = user_account.bump
    )]
    pub user_account: Box<Account<'info, User>>,

    pub create_key: Signer<'info>,

    #[account(
        init,
        payer = owners,
        space = Multisig::size(members.len()),
        seeds = [squads_multisig_program::SEED_PREFIX, squads_multisig_program::SEED_MULTISIG, create_key.key().as_ref()],
        bump
    )]
    pub multisig: Account<'info, Multisig>,

    #[account(address = squads_multisig_program::ID)]
    pub squads_program: Program<'info, squads_multisig_program::program::SquadsMultisigProgram>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateProjectContext>,
    counter: u64,
    multi_sig: Pubkey,
    metadata: String,
    members: Vec<Member>,
    threshold: u16,
    config_authority: Option<Pubkey>,
    time_lock: u32,
    memo: Option<String>,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project_account;
    let user_account = &mut ctx.accounts.user_account;

    let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreate {
        create_key: ctx.accounts.create_key.to_account_info(), // this is example
        creator: ctx.accounts.owners.to_account_info(),
        multisig: user_account.to_account_info(), //
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let cpi_ctx_squads = CpiContext::new(
        ctx.accounts.squads_program.to_account_info(),
        create_multisig,
    );

    squads_multisig_program::cpi::multisig_create(
        cpi_ctx_squads,
        squads_multisig_program::MultisigCreateArgs {
            members,
            threshold,
            config_authority,
            time_lock,
            memo,
        },
    );

    project_account.owner = user_account.authority.key();
    project_account.status = ProjectVerification::UnderReview;
    project_account.counter = counter;
    project_account.multisig = multi_sig;
    project_account.bump = *ctx.bumps.get("project_account").unwrap();

    emit!(NewProject {
        authority: user_account.authority.key(),
        metadata,
        counter,
    });

    Ok(())
}
