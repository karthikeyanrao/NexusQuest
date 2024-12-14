use anchor_lang::prelude::*;
use crate::{constants::*, events::PointsWithdrawEvent, errors::PointsError, state::UserAccount};

pub fn handle(ctx: Context<WithdrawSol>, points_to_spend: u64) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;

    require!(
        user_account.points >= points_to_spend,
        PointsError::InsufficientPoints
    );

    let sol_to_withdraw = (points_to_spend * LAMPORTS_PER_SOL) / POINTS_PER_SOL;
    require!(
        user_account.sol_balance >= sol_to_withdraw,
        PointsError::InsufficientSOLBalance
    );

    user_account.points -= points_to_spend;
    user_account.sol_balance -= sol_to_withdraw;

    **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? += sol_to_withdraw;
    **ctx.accounts.program.to_account_info().try_borrow_mut_lamports()? -= sol_to_withdraw;

    emit!(PointsWithdrawEvent {
        user: user_account.owner,
        sol_amount: sol_to_withdraw,
        points_spent: points_to_spend,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub program: Program<'info, System>,
}
