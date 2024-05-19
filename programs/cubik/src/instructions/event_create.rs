use crate::{event::EventCreateEvent, state::*};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use squads_multisig_program::{Member, Permission, Permissions, SEED_PREFIX, SEED_VAULT};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct EventCreateArgs {
    metadata: String,
    start_slot: u64,
    ending_slot: u64,
    memo: Option<String>,
}

#[derive(Accounts)]
pub struct EventCreate<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub create_key: Signer<'info>,

    #[account(init,
        payer = authority,
        space = 8 + EventTeam::INIT_SPACE,
        seeds = [EVENT_PREFIX,event_account.key().as_ref(),TEAM_PREFIX,authority.key().as_ref()],
        bump
    )]
    pub event_team_account: Box<Account<'info, EventTeam>>,

    #[account(init,
        payer = authority,
        space = 8 + Event::INIT_SPACE,
        seeds = [EVENT_PREFIX,create_key.key().as_ref()],
        bump
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

impl EventCreate<'_> {
    pub fn event_create(ctx: Context<Self>, args: EventCreateArgs) -> Result<()> {
        let event_account = &mut ctx.accounts.event_account;
        let event_team_account = &mut ctx.accounts.event_team_account;

        // Vault
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
        let all_permissions = [Permission::Initiate, Permission::Vote, Permission::Execute];

        let permission = Permissions::from_vec(&all_permissions);

        let members: Vec<Member> = vec![ctx.accounts.authority.key(), VAULT_AUTHORITY]
            .iter()
            .map(|key| Member {
                key: *key,
                permissions: permission,
            })
            .collect();

        squads_multisig_program::cpi::multisig_create_v2(
            cpi_ctx_squads,
            squads_multisig_program::MultisigCreateArgsV2 {
                config_authority: None,
                members,
                memo: args.memo,
                threshold: 2,
                time_lock: 0,
                rent_collector: Some(VAULT_AUTHORITY),
            },
        )?;

        // Event Account
        event_account.authority = *ctx.accounts.authority.key;
        event_account.metadata = args.metadata.clone();
        event_account.event_type = EventType::QFROUND;
        event_account.create_key = *ctx.accounts.create_key.key;
        event_account.ending_slot = args.ending_slot;
        event_account.vault_pubkey = vault_pubkey;
        event_account.bump = ctx.bumps.event_account;

        //  Event Team Account
        event_team_account.authority = *ctx.accounts.authority.key;
        event_team_account.bump = ctx.bumps.event_team_account;

        emit!(EventCreateEvent {
            authority: *ctx.accounts.authority.key,
            create_key: *ctx.accounts.create_key.key,
            event_account: ctx.accounts.event_account.key(),
            metadata: args.metadata
        });
        Ok(())
    }
}
