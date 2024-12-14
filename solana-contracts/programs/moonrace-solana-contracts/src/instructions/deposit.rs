use anchor_lang::prelude::*;
use crate::{constants::*, events::PointsDepositEvent, errors::PointsError, state::UserAccount};

pub fn handle(ctx: Context<DepositForPoints>) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    let deposit_amount = ctx.accounts.system_program.to_account_info().lamports();

    require!(
        deposit_amount >= LAMPORTS_PER_SOL / 1000, // Minimum deposit of 0.001 SOL
        PointsError::InsufficientDeposit
    );

    let points_to_add = (deposit_amount * POINTS_PER_SOL) / LAMPORTS_PER_SOL;
    user_account.points += points_to_add;
    user_account.sol_balance += deposit_amount;

    emit!(PointsDepositEvent {
        user: user_account.owner,
        sol_amount: deposit_amount,
        points_received: points_to_add,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct DepositForPoints<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}
