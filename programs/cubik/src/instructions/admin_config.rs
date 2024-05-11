use crate::errors::Errors;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AdminConfigArgs {
    manager_keys: Option<Vec<Pubkey>>,
}

#[derive(Accounts)]
pub struct AdminConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [ADMIN_PREFIX],
        bump = admin_account.bump
    )]
    pub admin_account: Box<Account<'info, Admin>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl AdminConfig<'_> {
    pub fn validate(&self) -> Result<()> {
        require_eq!(
            self.authority.key(),
            self.admin_account.authority.key(),
            Errors::InvalidAdmin
        );
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn admin_config(ctx: Context<Self>, args: AdminConfigArgs) -> Result<()> {
        let admin_account = &mut ctx.accounts.admin_account;

        if args.manager_keys.is_some() {
            admin_account.managers = args.manager_keys.unwrap();
        }
        Ok(())
    }
}
