use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::Errors;
use anchor_lang::solana_program::{self, system_program, sysvar::rent::Rent};
use squads_multisig_program::{self,Member, Permission, Permissions, SEED_PREFIX, SEED_VAULT};

pub fn create_admin_handler(ctx: Context<CreateAdminContext>) -> Result<()> {
    let admin_account = &mut ctx.accounts.admin_account;
    admin_account.authority = ctx.accounts.authority.key();
    admin_account.bump = ctx.bumps.admin_account;
    Ok(())
}



pub fn create_admin_vault_handler(ctx: Context<CreateAdminVaultContext>,members_keys: Vec<Pubkey>,
    memo: Option<String>
) -> Result<()> {

    let admin_vault = &mut ctx.accounts.admin_vault;

    let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreate {
        create_key: ctx.accounts.create_key.to_account_info(), // this is example
        creator: ctx.accounts.authority.to_account_info(),
        multisig: ctx.accounts.multisig.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

  
    require!(members_keys.len() == 3, Errors::InvalidMembersLength);

    let cpi_ctx_squads = CpiContext::new(
        ctx.accounts.squads_program.to_account_info(),
        create_multisig,
    );
    let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

    let permission = Permissions::from_vec(&all_permissions);

    let (vault_pubkey, _vault_bump_seed) = Pubkey::find_program_address(
        &[
            SEED_PREFIX,
            &ctx.accounts.multisig.key().to_bytes(),
            SEED_VAULT,
            &[0],
        ],
        &squads_multisig_program::ID,
    );

    let members: Vec<Member> = members_keys
        .iter()
        .map(|key| Member {
            key: *key,
            permissions: permission,
        })
        .collect();

    let _ = squads_multisig_program::cpi::multisig_create(
        cpi_ctx_squads,
        squads_multisig_program::MultisigCreateArgs {
            config_authority: None,
            members,
            memo,
            threshold:2,
            time_lock:0,
        },
    );
    admin_vault.create_key = ctx.accounts.create_key.key();
    admin_vault.vault_pubkey = vault_pubkey;
    admin_vault.multi_sig = ctx.accounts.multisig.key();
    admin_vault.bump = ctx.bumps.admin_vault;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateAdminContext<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + Admin::INIT_SPACE,
        seeds = [b"admin".as_ref()],
        bump 
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}







#[derive(Accounts)]
pub struct CreateAdminVaultContext<'info> {

    #[account(mut, constraint = authority.key() == sub_admin_account.authority.key())]
    pub authority: Signer<'info>,
    
    pub create_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + AdminVault::INIT_SPACE,
        seeds = [b"admin".as_ref(), b"vault".as_ref()],
        bump,
    )]
    pub admin_vault : Box<Account<'info, AdminVault>>,

    #[account(mut,
        constraint = sub_admin_account.level == 3,
        seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), sub_admin_account.create_key.key().as_ref()],
        bump =  sub_admin_account.bump,
    )]
    pub sub_admin_account: Account<'info, SubAdmin>,

    /// CHECK: This is a CPI account
    #[account(mut)]
    pub multisig: UncheckedAccount<'info>,

    #[account(address = squads_multisig_program::ID)]
    pub squads_program: Program<'info, squads_multisig_program::program::SquadsMultisigProgram>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = solana_program::sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,
}