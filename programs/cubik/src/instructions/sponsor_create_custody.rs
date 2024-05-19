use crate::errors::Errors;
use crate::event::SponsorCreateEvent;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::{self};
use squads_multisig_program::{Member, Permission, Permissions, SEED_PREFIX, SEED_VAULT};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SponsorCreateCustodyArgs {
    pub metadata: String,
    pub member: Pubkey,
    pub memo: Option<String>,
}

#[derive(Accounts)]
pub struct SponsorCreateCustody<'info> {
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

impl SponsorCreateCustody<'_> {
    pub fn validate(&self, args: &SponsorCreateCustodyArgs) -> Result<()> {
        require_keys_neq!(args.member, *self.authority.key);

        let current_slot = Clock::get()?.slot;

        if current_slot > self.event_account.ending_slot {
            return err!(Errors::EventEnded);
        }
        Ok(())
    }

    #[access_control(ctx.accounts.validate(&args))]
    pub fn sponsor_create_custody(
        ctx: Context<SponsorCreateCustody>,
        args: SponsorCreateCustodyArgs,
    ) -> Result<()> {
        let sponsor_account = &mut ctx.accounts.sponsor_account;
        let event_account = &ctx.accounts.event_account;
        let create_multisig = squads_multisig_program::cpi::accounts::MultisigCreateV2 {
            program_config: ctx.accounts.program_config_pda.to_account_info(),
            treasury: ctx.accounts.treasury.to_account_info(),
            create_key: ctx.accounts.create_key.to_account_info(),
            creator: ctx.accounts.authority.to_account_info(),
            multisig: ctx.accounts.multisig.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };

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
        // Full Permission Signers
        let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

        let permission = Permissions::from_vec(&all_permissions);

        let mut members: Vec<Member> = vec![
            ctx.accounts.authority.key(),
            event_account.authority.key(),
            args.member,
        ]
        .iter()
        .map(|key| Member {
            key: *key,
            permissions: permission,
        })
        .collect();

        // Signer to Create Tx
        members.push(Member {
            key: VAULT_AUTHORITY,
            permissions: Permissions::from_vec(&[Permission::Initiate]),
        });

        squads_multisig_program::cpi::multisig_create_v2(
            cpi_ctx_squads,
            squads_multisig_program::MultisigCreateArgsV2 {
                config_authority: None,
                members,
                memo: None,
                threshold: 2,
                time_lock: 0,
                rent_collector: Some(VAULT_AUTHORITY),
            },
        )?;

        // Sponsor Account
        sponsor_account.authority = ctx.accounts.authority.key();
        sponsor_account.vault_key = vault_pubkey;
        sponsor_account.metadata = args.metadata.clone();
        sponsor_account.create_key = ctx.accounts.create_key.key();
        sponsor_account.bump = ctx.bumps.sponsor_account;

        emit!(SponsorCreateEvent {
            authority: ctx.accounts.authority.key(),
            create_key: ctx.accounts.create_key.key(),
            event_account: ctx.accounts.event_account.key(),
            sponsor_account: ctx.accounts.sponsor_account.key(),
            metadata: args.metadata,
            vault_key: vault_pubkey
        });

        Ok(())
    }
}
