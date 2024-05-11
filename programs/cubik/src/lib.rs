use anchor_lang::prelude::*;
mod errors;
pub mod event;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("ADohpkV8Cm4vzPGss4977oncQwD7R6Ac66iw6t4sZWmc");
// declare_id!("CUbkXMRWxumGzDwf43ysyFm3da77JRuUqLF1bmW4tGoZ");

#[program]
pub mod cubik {

    use super::*;

    pub fn project_create(ctx: Context<ProjectCreate>, args: ProjectCreateArgs) -> Result<()> {
        ProjectCreate::project_create(ctx, args);
        Ok(())
    }
}
