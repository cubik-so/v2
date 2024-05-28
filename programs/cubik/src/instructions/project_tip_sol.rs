use crate::event::TipSOLEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::system_program;
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectTipSOLArgs {
    pub amount: u64, // Amount of token with decimals
}

#[derive(Accounts)]
pub struct ProjectTipSOL<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Receiver is the project account
    #[account(mut, constraint = project_account.receiver.key() == receiver.key())]
    pub receiver: AccountInfo<'info>,

    #[account(mut,
        seeds = [PROJECT_PREFIX,project_account.create_key.key().as_ref()],
        bump = project_account.bump
    )]
    pub project_account: Box<Account<'info, Project>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl ProjectTipSOL<'_> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }

    #[access_control(ctx.accounts.validate())]
    pub fn project_tip_sol(ctx: Context<Self>, args: ProjectTipSOLArgs) -> Result<()> {
        let project_account = &ctx.accounts.project_account;
        let receiver = &ctx.accounts.receiver;
        let transfer_instruction = system_instruction::transfer(
            ctx.accounts.authority.key,
            &project_account.receiver,
            args.amount,
        );

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.authority.to_account_info(),
                receiver.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        emit!(TipSOLEvent {
            amount: args.amount,
            authority: ctx.accounts.authority.key(),
            project_create_key: ctx.accounts.project_account.create_key.key(),
        });
        Ok(())
    }
}
