use crate::constant::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use squads_multisig_program::{Member, Permission, Permissions, SEED_PREFIX, SEED_VAULT};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectCreateArgs {
    metadata: String,
    memo: Option<String>,
}

/// todo - Add Docs
#[derive(Accounts)]
pub struct ProjectCreate<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    pub create_key: Signer<'info>,

    #[account(init,
        payer = creator,
        space = 8 + Project::INIT_SPACE,
        seeds = [PROJECT_PREFIX,create_key.key().as_ref()],
        bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    /// CHECK: This is a program config account
    #[account(mut)]
    pub program_config_pda: UncheckedAccount<'info>,

    /// CHECK: This is a program config treasury account
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,

    /// CHECK: This is a CPI account
    #[account(mut)]
    pub multisig: UncheckedAccount<'info>,

    #[account(address = squads_multisig_program::ID)]
    pub squads_program: Program<'info, squads_multisig_program::program::SquadsMultisigProgram>,
    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}
/// todo - Add Docs
impl ProjectCreate<'_> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn project_create(ctx: Context<Self>, args: ProjectCreateArgs) -> Result<()> {
        let project_account = &mut ctx.accounts.project_account;

        let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreateV2 {
            program_config: ctx.accounts.program_config_pda.to_account_info(),
            treasury: ctx.accounts.treasury.to_account_info(),
            create_key: ctx.accounts.create_key.to_account_info(),
            creator: ctx.accounts.creator.to_account_info(),
            multisig: ctx.accounts.multisig.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };

        msg!(&ctx.accounts.treasury.to_account_info().key().to_string());

        let (vault_pubkey, _vault_bump_seed) = Pubkey::find_program_address(
            &[
                SEED_PREFIX,
                &ctx.accounts.multisig.key().to_bytes(),
                SEED_VAULT,
                &[0],
            ],
            &squads_multisig_program::ID,
        );

        let cpi_ctx_squads = CpiContext::new(
            ctx.accounts.squads_program.to_account_info(),
            create_multisig,
        );
        let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

        let permission = Permissions::from_vec(&all_permissions);

        let members: Vec<Member> = vec![ctx.accounts.creator.key(), VAULT_AUTHORITY]
            .iter()
            .map(|key| Member {
                key: *key,
                permissions: permission,
            })
            .collect();

        squads_multisig_program::cpi::multisig_create_v2(
            cpi_ctx_squads,
            squads_multisig_program::MultisigCreateArgsV2 {
                config_authority: Some(CONFIG_AUTHORITY),
                members,
                memo: args.memo,
                threshold: 2,
                time_lock: 0,
                rent_collector: Some(VAULT_AUTHORITY),
            },
        )?;

        project_account.creator = ctx.accounts.creator.key();
        project_account.metadata = args.metadata;
        project_account.status = ProjectVerification::UnderReview;
        project_account.create_key = ctx.accounts.create_key.key();
        project_account.reciver = vault_pubkey.key();
        project_account.vault_pubkey = vault_pubkey.key();
        project_account.bump = ctx.bumps.project_account;

        Ok(())
    }
}
