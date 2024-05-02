// #[derive(Accounts)]
// pub struct InviteEventJoinContext<'info> {
//     #[account(mut,
//         constraint = authority.key() == sub_admin_account.authority.key() @ Errors::InvalidSigner,
//         constraint = sub_admin_account.level == 3 @Errors::InvalidAdmin,
//     )]
//     pub authority: Signer<'info>,

//     #[account(init,
//         payer = authority,
//         space = 8 + EventJoin::INIT_SPACE,
//         seeds = [b"event_join".as_ref(),event_account.key().as_ref(),project_account.key().as_ref()],
//         bump
//     )]
//     pub event_join_account: Box<Account<'info, EventJoin>>,

//     #[account(mut,
//         seeds = [b"admin".as_ref(), sub_admin_account.authority.key().as_ref(), sub_admin_account.create_key.key().as_ref()],
//         bump = sub_admin_account.bump
//     )]
//     pub sub_admin_account: Box<Account<'info, SubAdmin>>,

//     #[account(mut,
//             seeds=[b"project",project_account.create_key.key().as_ref(),project_account.counter.to_le_bytes().as_ref()],
//             bump = project_account.bump
//         )]
//     pub project_account: Box<Account<'info, Project>>,

//     #[account(mut,seeds=[b"event",event_account.event_key.key().as_ref()],bump=event_account.bump)]
//     pub event_account: Box<Account<'info, Event>>,

//     // Misc Accounts
//     #[account(address = system_program::ID)]
//     pub system_program: Program<'info, System>,
//     #[account(address = solana_program::sysvar::rent::ID)]
//     pub rent: Sysvar<'info, Rent>,
// }
