use crate::errors::Errors;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SponsorCreateArgs {
    metadata: String,
}

#[derive(Accounts)]
pub struct SponsorCreate<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(init,
         space = 8 + Sponsor::INIT_SPACE,
        payer = authority,
        seeds = [SPONSOR_PREFIX, event_account.key().as_ref(),create_key.key().as_ref()],
        bump
    )]
    pub sponsor_account: Box<Account<'info, Sponsor>>,

    #[account(mut,
        seeds = [EVENT_PREFIX,event_account.create_key.as_ref()],
        bump = event_account.bump
    )]
    pub event_account: Box<Account<'info, Event>>,

    // Misc Accounts
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

impl SponsorCreate<'_> {
    pub fn validate(&self) -> Result<()> {
        let current_slot = Clock::get()?.slot;

        if current_slot > self.event_account.ending_slot {
            return err!(Errors::EventEnded);
        }
        Ok(())
    }

    pub fn sponsor_create(ctx: Context<SponsorCreate>, args: SponsorCreateArgs) -> Result<()> {
        let sponsor_account = &mut ctx.accounts.sponsor_account;

        sponsor_account.authority = ctx.accounts.authority.key();
        sponsor_account.vault_key = ctx.accounts.event_account.vault_pubkey.key();
        sponsor_account.create_key = ctx.accounts.create_key.key();
        sponsor_account.metadata = args.metadata;
        sponsor_account.bump = ctx.bumps.sponsor_account;

        Ok(())
    }
}
