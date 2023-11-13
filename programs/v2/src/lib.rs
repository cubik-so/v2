use anchor_lang::prelude::*;

declare_id!("3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS");

#[program]
pub mod v2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
