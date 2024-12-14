use anchor_lang::prelude::*;
pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("42XWFD3ezErGfXNF4CpWYqBzcUBo1bsgyC6YGNi5qz1c");

#[program]
pub mod moonrace_solana_contracts {
    use super::*;

   pub fn deposit_for_points(ctx: Context<DepositForPoints>) -> Result<()> {
        instructions::deposit::handle(ctx)
    }

    pub fn withdraw_sol(ctx: Context<WithdrawSol>, points_to_spend: u64) -> Result<()> {
        instructions::withdraw::handle(ctx, points_to_spend)
    }

    pub fn subtract_points(ctx: Context<AdminSubtractPoints>, points_to_subtract: u64) -> Result<()> {
        instructions::subtract::handle(ctx, points_to_subtract)
    }
}
