#[warn(unused_must_use)]
use anchor_lang::prelude::*;
mod constant;
mod errors;
pub mod event;
pub mod instructions;
use instructions::*;
pub mod state;
use state::*;

// declare_id!("GsKHdvSBodD3ZGMAMWZ6sSwNZAixsE6XZ4xKA4KyEwc");
declare_id!("CUbkXMRWxumGzDwf43ysyFm3da77JRuUqLF1bmW4tGoZ");

#[program]
pub mod cubik {

    use super::*;
}
